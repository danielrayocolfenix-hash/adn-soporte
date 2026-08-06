from shared.domain.exceptions import (
    BusinessRuleValidationException,
    EntityNotFoundException,
)


class QaNotFoundException(EntityNotFoundException):
    default_message = "La prueba QA solicitada no existe."
    internal_code = "QA_NOT_FOUND"


class InvalidQaTransitionException(BusinessRuleValidationException):
    default_message = "La prueba QA no puede pasar a ese estado desde su estado actual."
    internal_code = "QA_INVALID_TRANSITION"
