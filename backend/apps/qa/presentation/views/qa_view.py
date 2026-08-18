from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from apps.qa.infraestructure.models.qa_model import QaModel
from apps.qa.infraestructure.services.estado_historial import registrar_cambio_estado
from apps.qa.presentation.permissions.qa_permissions import QaPermissions
from apps.qa.presentation.serializers.qa_serializer import QaSerializer


class QaViewSet(viewsets.ModelViewSet):
    queryset = QaModel.objects.select_related("responsable").prefetch_related(
        "errores_vinculados", "historial_estados__usuario", "casos_prueba_regresion"
    )
    serializer_class = QaSerializer
    permission_classes = [QaPermissions]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(responsable=self.request.user)

    def perform_update(self, serializer):
        estado_anterior = serializer.instance.estado
        instance = serializer.save()
        usuario = self.request.user if self.request.user.is_authenticated else None
        registrar_cambio_estado(instance, estado_anterior, instance.estado, usuario)
