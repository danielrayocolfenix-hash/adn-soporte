import uuid
from abc import ABC, abstractmethod

from apps.qa.domain.entities.qa import Qa


class QaRepository(ABC):
    """Puerto de salida: contrato que debe cumplir cualquier implementación
    de persistencia (Django ORM, en memoria para tests, etc.)."""

    @abstractmethod
    def create(self, qa: Qa) -> Qa:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, qa_id: uuid.UUID) -> Qa | None:
        raise NotImplementedError

    @abstractmethod
    def update(self, qa: Qa) -> Qa:
        raise NotImplementedError

    @abstractmethod
    def delete(self, qa_id: uuid.UUID) -> None:
        raise NotImplementedError

    @abstractmethod
    def list(self, **filters) -> list[Qa]:
        raise NotImplementedError
