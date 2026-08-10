from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class ErrorPermissions(BasePermission):
    """Reglas de autorización de la consola de errores. Hoy solo exige
    autenticación, igual que el resto de módulos del sistema."""

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated)
