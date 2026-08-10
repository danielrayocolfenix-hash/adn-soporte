from rest_framework import viewsets

from apps.seguimiento.infraestructure.models.tarea_model import TareaModel
from apps.seguimiento.presentation.permissions.tarea_permissions import TareaPermissions
from apps.seguimiento.presentation.serializers.tarea_serializer import TareaSerializer


class TareaViewSet(viewsets.ModelViewSet):
    queryset = TareaModel.objects.select_related("responsable", "qa_origen").all()
    serializer_class = TareaSerializer
    permission_classes = [TareaPermissions]

    def perform_create(self, serializer):
        serializer.save(responsable=self.request.user)
