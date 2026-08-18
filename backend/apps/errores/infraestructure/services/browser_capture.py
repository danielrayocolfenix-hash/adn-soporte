import hashlib
import re

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.errores.domain.value_objects.nivel import NivelError
from apps.errores.infraestructure.services.fingerprint import normalize_message
from apps.errores.infraestructure.services.qa_link import (
    create_linked_qa_ticket,
    escalar_prioridad_si_recurrente,
    reopen_qa_ticket_if_resolved,
    resolve_responsable,
)

_STACK_FRAME_RE = re.compile(
    r"at\s+(?:(?P<function>.+?)\s+\()?(?P<file>[^\s()]+):(?P<line>\d+):(?P<col>\d+)\)?"
)


def _parse_stack_frames(stack: str) -> list[dict]:
    """Convierte un stack trace de V8 (formato "at fn (archivo:línea:col)")
    en la misma forma estructurada que usa StackFrameList en el frontend.
    El frame superior (el punto real donde se lanzó el error) se marca
    `in_app` para que la consola lo resalte, aunque no sea código de este
    backend: es lo más relevante de un stack que no podemos mapear a
    fuente real (bundle minificado de una app que no controlamos)."""
    frames = []
    for match in _STACK_FRAME_RE.finditer(stack or ""):
        frames.append(
            {
                "file": match.group("file"),
                "line": int(match.group("line")),
                "column": int(match.group("col")),
                "function": (match.group("function") or "<anónimo>").strip(),
                "code_context": "",
                "context_lines": [],
                "in_app": False,
            }
        )
    if frames:
        frames[0]["in_app"] = True
    return frames


def _primary_error(console_errors: list[dict], page_errors: list[dict]) -> dict:
    if page_errors:
        primary = page_errors[0]
        return {
            "exception_type": primary.get("name") or "Error",
            "mensaje": primary.get("message") or "Error de JavaScript no controlado.",
            "stack_text": primary.get("stack") or "",
        }
    primary = console_errors[0]
    default_message = "Error registrado en la consola del navegador."
    return {
        "exception_type": "ConsoleError",
        "mensaje": primary.get("message") or default_message,
        "stack_text": f"{primary.get('url', '')}:{primary.get('line', 0)}",
    }


def _format_stack_text(console_errors: list[dict], page_errors: list[dict]) -> str:
    parts = []
    for err in page_errors:
        name = err.get("name", "Error")
        message = err.get("message", "")
        stack = err.get("stack", "")
        parts.append(f"{name}: {message}\n{stack}")
    for err in console_errors:
        message = err.get("message", "")
        url = err.get("url", "")
        line = err.get("line", 0)
        parts.append(f"console.error: {message} ({url}:{line})")
    return "\n\n".join(parts)[:20000]


def capture_browser_errors(
    *,
    url: str,
    path: str,
    console_errors: list[dict],
    page_errors: list[dict],
    triggered_by=None,
):
    """Registra los errores de JavaScript detectados por el navegador
    headless (`browser_prober.probe_with_browser`), agrupándolos y
    vinculándolos a un ticket QA igual que `capture_service.capture_exception`
    hace con las excepciones de Python. Devuelve `None` si no hay nada que
    capturar (la página cargó sin errores)."""
    if not console_errors and not page_errors:
        return None

    from apps.errores.infraestructure.models.error_model import (
        ErrorGroupModel,
        append_occurrence,
    )

    primary = _primary_error(console_errors, page_errors)
    fingerprint_source = f"browser::{path}::{normalize_message(primary['mensaje'])}"
    fingerprint = hashlib.sha256(fingerprint_source.encode("utf-8")).hexdigest()
    now = timezone.now()

    rolling_fields = {
        "exception_type": primary["exception_type"],
        "mensaje": primary["mensaje"][:2000],
        "stack_frames": _parse_stack_frames(primary["stack_text"]),
        "stack_trace_text": _format_stack_text(console_errors, page_errors),
        "nivel": NivelError.ERROR.value,
        "ambiente": getattr(settings, "APP_ENVIRONMENT", "Development"),
        "http_method": "GET",
        "path": path,
        "query_params": {},
        "headers": {},
        "usuario": None,
        "ip_address": None,
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
            create_linked_qa_ticket(group, resolve_responsable(triggered_by))
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
