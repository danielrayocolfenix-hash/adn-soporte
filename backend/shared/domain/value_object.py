from dataclasses import dataclass


@dataclass(frozen=True)
class ValueObject:
    """Objeto inmutable comparado por valor, no por identidad."""
