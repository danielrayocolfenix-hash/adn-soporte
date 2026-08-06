from apps.qa.domain.entities.qa import Qa
from apps.qa.domain.value_objects.estado import EstadoQa


class QaValidator:
    """Servicio de dominio: reglas que involucran a la entidad Qa como un todo
    (p.ej. transiciones de estado válidas según el FLUJO QA). Sin implementar
    todavía — es responsabilidad de la fase de implementación del módulo."""

    def puede_transicionar(self, qa: Qa, nuevo_estado: EstadoQa) -> bool:
        raise NotImplementedError
