from django.urls import path

from apps.usuarios.presentation.views.usuario_view import MeView

app_name = "usuarios"
urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
]
