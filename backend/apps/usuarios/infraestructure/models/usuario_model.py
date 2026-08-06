from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    """Modelo de usuario custom, fijado como AUTH_USER_MODEL desde el inicio
    del proyecto para evitar tener que resetear la base de datos más
    adelante. Los campos de negocio (rol, cargo, etc.) se añaden cuando el
    módulo de roles/permisos se implemente."""

    class Meta:
        db_table = "usuarios"
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self) -> str:
        return self.get_username()
