from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class TareaPermissions(BasePermission):
    """Reglas de autorización del tablero Kanban de tareas. Hoy solo exige
    autenticación; la granularidad por rol (líder QA / líder de desarrollo
    para cerrar tareas) se añade cuando el módulo roles esté implementado."""

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated)
