from enum import Enum


class EstadoTarea(str, Enum):
    """Flujo Kanban de tareas de desarrollo, desde creación hasta el cierre
    por parte de un líder QA o de desarrollo tras el deploy."""

    HACER = "hacer"
    EN_CURSO = "en_curso"
    EN_PROCESO = "en_proceso"
    TERMINADO = "terminado"
    CERRADO = "cerrado"
