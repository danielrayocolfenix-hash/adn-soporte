from apps.qa.domain.value_objects.estado import EstadoQa
from apps.seguimiento.domain.value_objects.estado import EstadoTarea

# Única fuente de verdad para la trazabilidad QA -> Kanban: a qué columna
# del tablero de tareas corresponde cada estado del flujo QA. Una tarea
# generada desde un QA (`TareaModel.qa_origen`) siempre refleja el estado
# de su QA de origen según este mapa.
MAPA_ESTADO_QA_A_TAREA: dict[EstadoQa, EstadoTarea] = {
    EstadoQa.NUEVA: EstadoTarea.HACER,
    EstadoQa.EN_PROCESO: EstadoTarea.EN_CURSO,
    EstadoQa.CORRECCION: EstadoTarea.EN_CURSO,
    EstadoQa.RECHAZADA: EstadoTarea.EN_CURSO,
    EstadoQa.PENDIENTE_VALIDACION: EstadoTarea.EN_PROCESO,
    EstadoQa.VALIDACION_FINAL: EstadoTarea.EN_PROCESO,
    EstadoQa.APROBADA: EstadoTarea.TERMINADO,
    EstadoQa.CERRADA: EstadoTarea.CERRADO,
    # Una regresión implica retomar el trabajo, igual que una corrección.
    EstadoQa.REABIERTA: EstadoTarea.EN_CURSO,
}


def mapear_estado_qa_a_tarea(estado_qa: str) -> str:
    return MAPA_ESTADO_QA_A_TAREA[EstadoQa(estado_qa)].value
