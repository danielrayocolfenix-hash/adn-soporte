from django.apps import AppConfig


class SeguimientoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.seguimiento"
    label = "seguimiento"
    verbose_name = "Seguimiento"

    def ready(self) -> None:
        from apps.seguimiento.infraestructure import signals  # noqa: F401
