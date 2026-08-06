class DomainException(Exception):
    """Excepción base para violaciones de reglas de negocio en la capa domain."""

    default_message = "Ocurrió un error de dominio."
    internal_code = "DOMAIN_ERROR"

    def __init__(self, message: str | None = None):
        super().__init__(message or self.default_message)
        self.message = message or self.default_message


class EntityNotFoundException(DomainException):
    default_message = "El recurso solicitado no existe."
    internal_code = "ENTITY_NOT_FOUND"


class BusinessRuleValidationException(DomainException):
    default_message = "La operación no cumple con una regla de negocio."
    internal_code = "BUSINESS_RULE_VIOLATION"
