from rest_framework.permissions import AllowAny
from rest_framework.views import APIView


class DebugBoomView(APIView):
    """Vista de prueba, montada solo bajo settings.DEBUG, para verificar
    manualmente que la captura automática de errores funciona de punta a
    punta (ver config/urls.py)."""

    permission_classes = [AllowAny]

    def get(self, request):
        raise RuntimeError("Error de prueba para el monitor de errores")
