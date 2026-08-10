import logging

from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.db import IntegrityError
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework.views import exception_handler as drf_exception_handler

from shared.domain.exceptions import DomainException
from shared.presentation.response import error_response

logger = logging.getLogger("adn_soporte")

_DEFAULT_ACTION = "Intente nuevamente. Si el problema persiste, contacte a soporte."

_STATUS_MESSAGES = {
    400: ("La solicitud contiene datos inválidos.", "BAD_REQUEST"),
    401: ("Debe iniciar sesión para continuar.", "UNAUTHENTICATED"),
    403: ("No tiene permisos para realizar esta acción.", "PERMISSION_DENIED"),
    404: ("El recurso solicitado no existe.", "NOT_FOUND"),
    405: ("Esta operación no está permitida.", "METHOD_NOT_ALLOWED"),
    429: (
        "Demasiadas solicitudes. Intente nuevamente en unos minutos.",
        "RATE_LIMITED",
    ),
}


def custom_exception_handler(exc, context):
    """Traduce cualquier excepción a la respuesta amigable del contrato de la API.

    Nunca deja pasar tracebacks, errores de SQL ni excepciones crudas de
    Python/Django hacia el cliente.
    """
    if isinstance(exc, DomainException):
        logger.warning("DomainException: %s", exc)
        return error_response(
            message=exc.message,
            status_code=400,
            internal_code=exc.internal_code,
            action=_DEFAULT_ACTION,
        )

    if isinstance(exc, IntegrityError):
        logger.error("IntegrityError", exc_info=True)
        return error_response(
            message=(
                "No fue posible guardar la información porque ya existe un "
                "registro con esos datos."
            ),
            status_code=409,
            internal_code="INTEGRITY_ERROR",
            action="Verifique los datos ingresados e intente nuevamente.",
        )

    if isinstance(exc, Http404):
        exc = drf_exceptions.NotFound()
    elif isinstance(exc, DjangoPermissionDenied):
        exc = drf_exceptions.PermissionDenied()

    response = drf_exception_handler(exc, context)

    if response is not None:
        message, internal_code = _friendly_message_for(exc, response.status_code)
        logger.warning("%s: %s", internal_code, exc)
        return error_response(
            message=message,
            status_code=response.status_code,
            internal_code=internal_code,
            action=_DEFAULT_ACTION if response.status_code >= 500 else None,
            retry=response.status_code >= 500,
        )

    logger.critical("Unhandled exception", exc_info=True)
    _safe_capture_error(exc, context)
    return error_response(
        message=(
            "Ocurrió un problema interno. Nuestro equipo ya fue notificado. "
            "Intente nuevamente."
        ),
        status_code=500,
        internal_code="INTERNAL_SERVER_ERROR",
        action=_DEFAULT_ACTION,
        retry=True,
    )


def _safe_capture_error(exc: Exception, context: dict) -> None:
    """Registra la excepción en el monitor de errores. Nunca debe romper ni
    enmascarar la respuesta 500 original si la captura misma falla."""
    try:
        from apps.errores.infraestructure.services.capture_service import (
            capture_exception,
        )

        capture_exception(exc, context)
    except Exception:
        logger.error(
            "No se pudo registrar el error en el monitor de errores", exc_info=True
        )


def _friendly_message_for(exc, status_code: int) -> tuple[str, str]:
    if isinstance(exc, drf_exceptions.ValidationError):
        return (
            "Algunos campos no son válidos. Revise la información ingresada.",
            "VALIDATION_ERROR",
        )
    return _STATUS_MESSAGES.get(
        status_code, ("Ocurrió un error al procesar la solicitud.", "REQUEST_ERROR")
    )
