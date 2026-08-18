from enum import Enum


class EstadoCasoPrueba(str, Enum):
    """Resultado de la última ejecución (manual) de un caso de prueba."""

    NOT_TESTED = "not_tested"
    PASS = "pass"
    FAIL = "fail"
    BLOCKED = "blocked"
