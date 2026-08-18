from rest_framework import serializers

from apps.qa.domain.exceptions.qa_exception import InvalidQaTransitionException
from apps.qa.domain.services.qa_validator import QaValidator
from apps.qa.domain.value_objects.estado import EstadoQa
from apps.qa.infraestructure.models.qa_model import QaModel


class QaEstadoHistorialSerializer(serializers.Serializer):
    estado_anterior = serializers.CharField(allow_null=True)
    estado_nuevo = serializers.CharField()
    usuario_nombre = serializers.CharField(source="usuario.username", default=None, allow_null=True)
    created_at = serializers.DateTimeField()


class CasoPruebaRegresionSerializer(serializers.Serializer):
    """Vista reducida de un caso de prueba, para listarlo dentro del QA al
    que sirve de regresión (ver `CasoPruebaModel.qa_relacionado`)."""

    id = serializers.UUIDField()
    nombre = serializers.CharField()
    estado = serializers.CharField()


class QaSerializer(serializers.ModelSerializer):
    responsable_nombre = serializers.CharField(source="responsable.username", read_only=True)
    error_detalle = serializers.SerializerMethodField()
    historial_estados = QaEstadoHistorialSerializer(many=True, read_only=True)
    casos_prueba_regresion = CasoPruebaRegresionSerializer(many=True, read_only=True)

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
            "veces_reabierto",
            "historial_estados",
            "casos_prueba_regresion",
            "error_detalle",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "responsable", "veces_reabierto", "created_at", "updated_at"]

    def validate_estado(self, value: str) -> str:
        if self.instance is None:
            return value

        estado_actual = EstadoQa(self.instance.estado)
        nuevo_estado = EstadoQa(value)
        if not QaValidator().puede_transicionar(estado_actual, nuevo_estado):
            raise InvalidQaTransitionException(
                f"No se puede pasar de '{estado_actual.value}' a '{nuevo_estado.value}'."
            )
        return value

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
