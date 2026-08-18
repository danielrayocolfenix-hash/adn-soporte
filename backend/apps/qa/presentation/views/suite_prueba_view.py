from rest_framework import viewsets

from apps.qa.infraestructure.models.suite_prueba_model import SuitePruebaModel
from apps.qa.presentation.permissions.qa_permissions import QaPermissions
from apps.qa.presentation.serializers.suite_prueba_serializer import SuitePruebaSerializer


class SuitePruebaViewSet(viewsets.ModelViewSet):
    queryset = SuitePruebaModel.objects.prefetch_related("casos")
    serializer_class = SuitePruebaSerializer
    permission_classes = [QaPermissions]
