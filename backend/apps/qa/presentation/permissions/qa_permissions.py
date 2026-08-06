from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class QaPermissions(BasePermission):
    """Reglas de autorización del módulo QA (por rol: Líder QA, QA,
    Desarrollador, Soporte). Hoy solo exige autenticación; la granularidad
    por rol se añade cuando el módulo roles esté implementado."""

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated)
