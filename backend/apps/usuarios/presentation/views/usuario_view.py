from rest_framework import generics

from apps.usuarios.presentation.serializers.usuario_serializer import UsuarioSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UsuarioSerializer

    def get_object(self):
        return self.request.user
