from enum import Enum


class EstadoQa(str, Enum):
    """Estados del flujo QA definido en la planeación del módulo."""

    NUEVA = "nueva"
    EN_PROCESO = "en_proceso"
    PENDIENTE_VALIDACION = "pendiente_validacion"
    APROBADA = "aprobada"
    RECHAZADA = "rechazada"
    CORRECCION = "correccion"
    VALIDACION_FINAL = "validacion_final"
    CERRADA = "cerrada"
    REABIERTA = "reabierta"
