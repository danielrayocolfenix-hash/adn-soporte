import uuid
from dataclasses import dataclass
from datetime import date

from apps.qa.domain.value_objects.estado import EstadoQa
from apps.qa.domain.value_objects.priority import Priority
from shared.domain.entity import Entity


@dataclass(kw_only=True)
class Qa(Entity):
    titulo: str
    descripcion: str
    sistema: str
    modulo: str
    version: str
    responsable_id: uuid.UUID
    prioridad: Priority
    estado: EstadoQa = EstadoQa.NUEVA
    fecha: date
    ambiente: str
    resultado_esperado: str
    resultado_obtenido: str = ""
    observaciones: str = ""
    tiempo_invertido_minutos: int = 0
