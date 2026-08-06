from apps.qa.domain.entities.qa import Qa
from apps.qa.domain.repositories.qa_repository import QaRepository
from shared.application.use_case import UseCase


class UpdateQaUseCase(UseCase[Qa, Qa]):
    def __init__(self, qa_repository: QaRepository):
        self.qa_repository = qa_repository

    def execute(self, data: Qa) -> Qa:
        raise NotImplementedError
