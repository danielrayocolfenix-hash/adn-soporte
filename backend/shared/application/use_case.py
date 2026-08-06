from abc import ABC, abstractmethod
from typing import Generic, TypeVar

TInput = TypeVar("TInput")
TOutput = TypeVar("TOutput")


class UseCase(ABC, Generic[TInput, TOutput]):
    """Contrato base para un caso de uso de la capa application."""

    @abstractmethod
    def execute(self, data: TInput) -> TOutput:
        raise NotImplementedError
