from enum import Enum


class NivelError(str, Enum):
    """Severidad de un grupo de errores capturados."""

    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
