from apps.qa.domain.value_objects.estado import EstadoQa

# Grafo de transiciones válidas del flujo QA. Deliberadamente permisivo en
# los saltos "hacia adelante" y en el cierre rápido (nueva/en_proceso ->
# rechazada/cerrada) para no entorpecer la triage, pero bloquea saltos que
# se saltan por completo el ciclo dev -> QA (p.ej. nueva -> aprobada) y
# exige pasar por REABIERTA para reactivar un ticket ya cerrado, así queda
# registro explícito de la regresión en vez de perderla en un cambio directo.
TRANSICIONES_VALIDAS: dict[EstadoQa, set[EstadoQa]] = {
    EstadoQa.NUEVA: {EstadoQa.EN_PROCESO, EstadoQa.CORRECCION, EstadoQa.RECHAZADA, EstadoQa.CERRADA},
    EstadoQa.EN_PROCESO: {
        EstadoQa.PENDIENTE_VALIDACION,
        EstadoQa.CORRECCION,
        EstadoQa.RECHAZADA,
        EstadoQa.CERRADA,
    },
    EstadoQa.CORRECCION: {EstadoQa.EN_PROCESO, EstadoQa.PENDIENTE_VALIDACION, EstadoQa.CERRADA},
    EstadoQa.PENDIENTE_VALIDACION: {
        EstadoQa.VALIDACION_FINAL,
        EstadoQa.CORRECCION,
        EstadoQa.RECHAZADA,
        EstadoQa.CERRADA,
    },
    EstadoQa.VALIDACION_FINAL: {EstadoQa.APROBADA, EstadoQa.CORRECCION, EstadoQa.CERRADA},
    EstadoQa.APROBADA: {EstadoQa.CERRADA, EstadoQa.CORRECCION},
    EstadoQa.RECHAZADA: {EstadoQa.CERRADA, EstadoQa.EN_PROCESO},
    EstadoQa.CERRADA: {EstadoQa.REABIERTA},
    EstadoQa.REABIERTA: {EstadoQa.EN_PROCESO, EstadoQa.CORRECCION, EstadoQa.CERRADA},
}


class QaValidator:
    """Servicio de dominio: reglas que involucran el ciclo de vida completo
    de un QA (transiciones de estado válidas según el flujo QA)."""

    def puede_transicionar(self, estado_actual: EstadoQa, nuevo_estado: EstadoQa) -> bool:
        if estado_actual == nuevo_estado:
            return True
        return nuevo_estado in TRANSICIONES_VALIDAS.get(estado_actual, set())
