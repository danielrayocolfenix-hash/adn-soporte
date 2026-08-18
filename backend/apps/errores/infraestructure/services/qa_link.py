SYSTEM_USERNAME = "sistema-monitor"

_ESTADOS_RESUELTOS = {"aprobada", "validacion_final", "cerrada"}

# A partir de cuántas ocurrencias de un mismo error (ya con ticket abierto)
# se considera lo bastante recurrente como para subir su prioridad, aunque
# el nivel técnico no sea "critical".
_UMBRAL_RECURRENCIA_PRIORIDAD_ALTA = 5


def resolve_responsable(user):
    """Devuelve el usuario a asignar como responsable del ticket QA
    generado automáticamente: el usuario autenticado de la petición que
    falló, o una cuenta de sistema de respaldo cuando la petición era
    anónima (QaModel.responsable es obligatorio)."""
    if user is not None and getattr(user, "is_authenticated", False):
        return user

    from django.contrib.auth import get_user_model

    User = get_user_model()
    system_user, created = User.objects.get_or_create(
        username=SYSTEM_USERNAME,
        defaults={"email": "monitor@sistema.local", "first_name": "Monitor de errores"},
    )
    if created:
        system_user.set_unusable_password()
        system_user.save(update_fields=["password"])
    return system_user


def _modulo_from_path(path: str) -> str:
    parts = [part for part in path.strip("/").split("/") if part]
    if len(parts) > 2:
        return parts[2]
    return parts[0] if parts else "sistema"


def create_linked_qa_ticket(group, responsable):
    """Crea el ticket QA (categoría server_error) que documentará el
    diagnóstico y la solución de este grupo de errores, y lo vincula."""
    from apps.qa.infraestructure.models.qa_model import QaModel

    titulo = f"[{group.exception_type}] {group.path or 'Error de servidor'}"
    qa_ticket = QaModel.objects.create(
        titulo=titulo[:255],
        categoria="server_error",
        modulo=_modulo_from_path(group.path)[:100],
        ambiente=group.ambiente,
        codigo_error=str(group.id)[:50],
        resultado_esperado="La aplicación no debería lanzar este error.",
        resultado_obtenido=group.mensaje[:2000],
        responsable=responsable,
        prioridad="alta" if group.nivel == "critical" else "media",
    )
    group.qa_ticket = qa_ticket
    group.save(update_fields=["qa_ticket"])
    return qa_ticket


def reopen_qa_ticket_if_resolved(qa_ticket) -> None:
    """Si la recurrencia de un error ya venía con su ticket QA cerrado o
    aprobado, lo reabre: la solución previa no evitó que volviera a
    ocurrir. Queda como una regresión explícita (estado REABIERTA + contador),
    no como un ticket "nueva" indistinguible de uno recién creado."""
    if qa_ticket.estado not in _ESTADOS_RESUELTOS:
        return

    from apps.qa.infraestructure.services.estado_historial import (
        registrar_cambio_estado,
    )

    estado_anterior = qa_ticket.estado
    qa_ticket.estado = "reabierta"
    qa_ticket.veces_reabierto = qa_ticket.veces_reabierto + 1
    qa_ticket.save(update_fields=["estado", "veces_reabierto"])
    registrar_cambio_estado(qa_ticket, estado_anterior, "reabierta", usuario=None)


def escalar_prioridad_si_recurrente(qa_ticket, count: int) -> None:
    """Si un error ya vinculado a un ticket vuelve a ocurrir con suficiente
    frecuencia, sube su prioridad aunque el nivel técnico siga siendo
    "error" (no "critical"): la recurrencia también es una señal de
    impacto, no solo la severidad de una sola ocurrencia."""
    if qa_ticket.prioridad == "alta":
        return
    if count < _UMBRAL_RECURRENCIA_PRIORIDAD_ALTA:
        return

    qa_ticket.prioridad = "alta"
    qa_ticket.save(update_fields=["prioridad"])
