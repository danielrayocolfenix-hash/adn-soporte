from rest_framework import serializers

from apps.qa.infraestructure.models.caso_prueba_model import CasoPruebaModel


class CasoPruebaSerializer(serializers.ModelSerializer):
    responsable_nombre = serializers.CharField(
        source="responsable.username", read_only=True, default=None
    )
    qa_relacionado_titulo = serializers.CharField(
        source="qa_relacionado.titulo", read_only=True, default=None
    )

    class Meta:
        model = CasoPruebaModel
        fields = [
            "id",
            "suite",
            "nombre",
            "precondiciones",
            "pasos",
            "resultado_esperado",
            "resultado_obtenido",
            "estado",
            "qa_relacionado",
            "qa_relacionado_titulo",
            "responsable",
            "responsable_nombre",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
