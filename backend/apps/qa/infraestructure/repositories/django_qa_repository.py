import uuid

from apps.qa.domain.entities.qa import Qa
from apps.qa.domain.repositories.qa_repository import QaRepository


class DjangoQaRepository(QaRepository):
    """Adaptador de salida: implementa QaRepository sobre el ORM de Django."""

    def create(self, qa: Qa) -> Qa:
        raise NotImplementedError

    def get_by_id(self, qa_id: uuid.UUID) -> Qa | None:
        raise NotImplementedError

    def update(self, qa: Qa) -> Qa:
        raise NotImplementedError

    def delete(self, qa_id: uuid.UUID) -> None:
        raise NotImplementedError

    def list(self, **filters) -> list[Qa]:
        raise NotImplementedError
