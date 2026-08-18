from rest_framework import viewsets

from apps.qa.infraestructure.models.caso_prueba_model import CasoPruebaModel
from apps.qa.presentation.permissions.qa_permissions import QaPermissions
from apps.qa.presentation.serializers.caso_prueba_serializer import CasoPruebaSerializer


class CasoPruebaViewSet(viewsets.ModelViewSet):
    queryset = CasoPruebaModel.objects.select_related(
        "suite", "responsable", "qa_relacionado"
    )
    serializer_class = CasoPruebaSerializer
    permission_classes = [QaPermissions]

    def perform_create(self, serializer):
        serializer.save(responsable=self.request.user)
