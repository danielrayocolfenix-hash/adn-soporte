from rest_framework import serializers

from apps.errores.infraestructure.models.error_model import ErrorGroupModel


class ErrorGroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrorGroupModel
        fields = [
            "id",
            "exception_type",
            "mensaje",
            "nivel",
            "ambiente",
            "http_method",
            "path",
            "count",
            "first_seen",
            "last_seen",
            "qa_ticket",
        ]
        read_only_fields = fields


class ProbarEndpointSerializer(serializers.Serializer):
    url = serializers.CharField()
    qa_ticket = serializers.UUIDField(required=False, allow_null=True)


class ErrorGroupDetailSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(
        source="usuario.username", read_only=True, allow_null=True
    )

    class Meta:
        model = ErrorGroupModel
        fields = [
            "id",
            "fingerprint",
            "exception_type",
            "mensaje",
            "nivel",
            "ambiente",
            "http_method",
            "path",
            "query_params",
            "headers",
            "usuario",
            "usuario_nombre",
            "ip_address",
            "stack_frames",
            "stack_trace_text",
            "count",
            "first_seen",
            "last_seen",
            "ocurrencias_recientes",
            "qa_ticket",
            "ai_diagnostico",
            "ai_diagnostico_en",
        ]
        read_only_fields = fields
