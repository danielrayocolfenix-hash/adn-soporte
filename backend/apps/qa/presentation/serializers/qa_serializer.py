from rest_framework import serializers

from apps.qa.infraestructure.models.qa_model import QaModel


class QaSerializer(serializers.ModelSerializer):
    responsable_nombre = serializers.CharField(source="responsable.username", read_only=True)
    error_detalle = serializers.SerializerMethodField()

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
            "codigo_error",
            "pasos_reproduccion",
            "resultado_esperado",
            "resultado_obtenido",
            "imagen_antes",
            "imagen_despues",
            "responsable",
            "responsable_nombre",
            "prioridad",
            "estado",
            "error_detalle",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "responsable", "estado", "created_at", "updated_at"]

    def get_error_detalle(self, obj: QaModel) -> dict | None:
        """Diagnóstico automático (traza, contexto de la petición) cuando
        este ticket viene de un error de servidor capturado por el monitor
        de errores. `None` para tickets creados manualmente."""
        error_group = obj.errores_vinculados.first()
        if error_group is None:
            return None

        from apps.errores.presentation.serializers.error_serializer import (
            ErrorGroupDetailSerializer,
        )

        return ErrorGroupDetailSerializer(error_group).data
