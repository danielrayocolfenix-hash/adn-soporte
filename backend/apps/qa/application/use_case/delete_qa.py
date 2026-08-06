import uuid

from apps.qa.domain.repositories.qa_repository import QaRepository
from shared.application.use_case import UseCase


class DeleteQaUseCase(UseCase[uuid.UUID, None]):
    def __init__(self, qa_repository: QaRepository):
        self.qa_repository = qa_repository

    def execute(self, data: uuid.UUID) -> None:
        raise NotImplementedError
