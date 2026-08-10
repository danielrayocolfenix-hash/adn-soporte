from rest_framework import serializers

from apps.seguimiento.infraestructure.models.tarea_model import TareaModel


class TareaSerializer(serializers.ModelSerializer):
    responsable_nombre = serializers.CharField(source="responsable.username", read_only=True)
    qa_origen_titulo = serializers.CharField(source="qa_origen.titulo", read_only=True, default=None)

    class Meta:
        model = TareaModel
        fields = [
            "id",
            "titulo",
            "descripcion",
            "rama_github",
            "pr_url",
            "fecha_limite",
            "responsable",
            "responsable_nombre",
            "prioridad",
            "estado",
            "qa_origen",
            "qa_origen_titulo",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "responsable", "qa_origen", "created_at", "updated_at"]
