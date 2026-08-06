from django.apps import AppConfig


class AuthModuleConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.auth"
    label = "auth_module"
    verbose_name = "Autenticación"
