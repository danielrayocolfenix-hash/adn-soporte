from rest_framework import serializers

from apps.usuarios.infraestructure.models.usuario_model import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "date_joined",
        ]
        read_only_fields = ["id", "username", "is_staff", "date_joined"]
