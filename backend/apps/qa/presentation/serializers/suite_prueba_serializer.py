from rest_framework import serializers

from apps.qa.infraestructure.models.suite_prueba_model import SuitePruebaModel
from apps.qa.presentation.serializers.caso_prueba_serializer import CasoPruebaSerializer


class SuitePruebaSerializer(serializers.ModelSerializer):
    casos = CasoPruebaSerializer(many=True, read_only=True)
    total_casos = serializers.SerializerMethodField()
    pass_count = serializers.SerializerMethodField()
    fail_count = serializers.SerializerMethodField()
    blocked_count = serializers.SerializerMethodField()
    not_tested_count = serializers.SerializerMethodField()
    porcentaje_exito = serializers.SerializerMethodField()

    class Meta:
        model = SuitePruebaModel
        fields = [
            "id",
            "nombre",
            "descripcion",
            "casos",
            "total_casos",
            "pass_count",
            "fail_count",
            "blocked_count",
            "not_tested_count",
            "porcentaje_exito",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def _casos(self, obj: SuitePruebaModel) -> list:
        # `.casos` viene prefetcheado por el viewset; iterar en Python (en
        # vez de volver a filtrar con .filter()) evita golpear la BD de
        # nuevo por cada suite al listar varias.
        return list(obj.casos.all())

    def get_total_casos(self, obj: SuitePruebaModel) -> int:
        return len(self._casos(obj))

    def get_pass_count(self, obj: SuitePruebaModel) -> int:
        return sum(1 for c in self._casos(obj) if c.estado == "pass")

    def get_fail_count(self, obj: SuitePruebaModel) -> int:
        return sum(1 for c in self._casos(obj) if c.estado == "fail")

    def get_blocked_count(self, obj: SuitePruebaModel) -> int:
        return sum(1 for c in self._casos(obj) if c.estado == "blocked")

    def get_not_tested_count(self, obj: SuitePruebaModel) -> int:
        return sum(1 for c in self._casos(obj) if c.estado == "not_tested")

    def get_porcentaje_exito(self, obj: SuitePruebaModel) -> float | None:
        casos = self._casos(obj)
        ejecutados = [c for c in casos if c.estado != "not_tested"]
        if not ejecutados:
            return None
        aprobados = sum(1 for c in ejecutados if c.estado == "pass")
        return round(aprobados / len(ejecutados) * 100, 1)
