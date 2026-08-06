from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from apps.qa.infraestructure.models.qa_model import QaModel
from apps.qa.presentation.permissions.qa_permissions import QaPermissions
from apps.qa.presentation.serializers.qa_serializer import QaSerializer


class QaViewSet(viewsets.ModelViewSet):
    queryset = QaModel.objects.select_related("responsable").all()
    serializer_class = QaSerializer
    permission_classes = [QaPermissions]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(responsable=self.request.user)
