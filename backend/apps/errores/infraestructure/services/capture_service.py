from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.errores.domain.value_objects.nivel import NivelError
from apps.errores.infraestructure.services.fingerprint import (
    compute_fingerprint,
    exception_type_name,
)
from apps.errores.infraestructure.services.frames import (
    extract_frames,
    format_stack_text,
)
from apps.errores.infraestructure.services.qa_link import (
    create_linked_qa_ticket,
    escalar_prioridad_si_recurrente,
    reopen_qa_ticket_if_resolved,
    resolve_responsable,
)
from apps.errores.infraestructure.services.redaction import (
    client_ip,
    redact_query_params,
    safe_headers,
)


def capture_exception(exc: BaseException, context: dict):
    """Persiste (o actualiza) el grupo de error correspondiente a `exc` y
    garantiza que exista un ticket QA (categoría server_error) donde el
    equipo documente el diagnóstico y la solución.

    Debe llamarse solo desde un lugar que ya atrapa cualquier excepción que
    esta función pueda lanzar (ver `_safe_capture_error` en
    `shared/presentation/exception_handler.py`): un fallo aquí nunca debe
    impedir que el cliente reciba la respuesta 500 original.
    """
    from apps.errores.infraestructure.models.error_model import (
        ErrorGroupModel,
        append_occurrence,
    )

    request = context.get("request")
    fingerprint = compute_fingerprint(exc)
    now = timezone.now()

    user = getattr(request, "user", None) if request is not None else None
    if user is not None and not getattr(user, "is_authenticated", False):
        user = None

    if request is not None:
        query_params = redact_query_params(request.query_params.dict())
        headers = safe_headers(request)
        http_method = request.method or ""
        path = (request.path or "")[:500]
        ip_address = client_ip(request)
    else:
        query_params, headers, http_method, path, ip_address = {}, {}, "", "", None

    rolling_fields = {
        "exception_type": exception_type_name(exc),
        "mensaje": str(exc)[:2000],
        "stack_frames": extract_frames(exc),
        "stack_trace_text": format_stack_text(exc)[:20000],
        "nivel": NivelError.ERROR.value,
        "ambiente": getattr(settings, "APP_ENVIRONMENT", "Development"),
        "http_method": http_method,
        "path": path,
        "query_params": query_params,
        "headers": headers,
        "usuario": user,
        "ip_address": ip_address,
        "last_seen": now,
    }

    with transaction.atomic():
        group, created = ErrorGroupModel.objects.select_for_update().get_or_create(
            fingerprint=fingerprint,
            defaults={
                **rolling_fields,
                "count": 1,
                "first_seen": now,
                "ocurrencias_recientes": [now.isoformat()],
            },
        )
        if created:
            create_linked_qa_ticket(group, resolve_responsable(user))
        else:
            for field, value in rolling_fields.items():
                setattr(group, field, value)
            group.count = group.count + 1
            group.ocurrencias_recientes = append_occurrence(
                group.ocurrencias_recientes, now
            )
            group.save(
                update_fields=[*rolling_fields.keys(), "count", "ocurrencias_recientes"]
            )
            if group.qa_ticket_id:
                reopen_qa_ticket_if_resolved(group.qa_ticket)
                escalar_prioridad_si_recurrente(group.qa_ticket, group.count)

    return group
