import uuid

from apps.qa.domain.entities.qa import Qa
from apps.qa.domain.repositories.qa_repository import QaRepository
from apps.qa.domain.services.qa_validator import QaValidator
from shared.application.use_case import UseCase


class ApproveQaUseCase(UseCase[uuid.UUID, Qa]):
    def __init__(self, qa_repository: QaRepository, qa_validator: QaValidator):
        self.qa_repository = qa_repository
        self.qa_validator = qa_validator

    def execute(self, data: uuid.UUID) -> Qa:
        raise NotImplementedError
