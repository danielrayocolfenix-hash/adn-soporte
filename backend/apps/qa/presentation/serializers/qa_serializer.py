from rest_framework import serializers

from apps.qa.infraestructure.models.qa_model import QaModel


class QaSerializer(serializers.ModelSerializer):
    responsable_nombre = serializers.CharField(source="responsable.username", read_only=True)

    class Meta:
        model = QaModel
        fields = [
            "id",
            "titulo",
            "categoria",
            "modulo",
            "ambiente",
            "figma_url",
            "device_or_browser",
            "pasos_reproduccion",
            "resultado_esperado",
            "resultado_obtenido",
            "imagen_antes",
            "imagen_despues",
            "responsable",
            "responsable_nombre",
            "prioridad",
            "estado",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "responsable", "estado", "created_at", "updated_at"]
