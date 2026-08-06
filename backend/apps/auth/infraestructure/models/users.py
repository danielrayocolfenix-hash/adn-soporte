from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Modelo de usuario personalizado que extiende el modelo AbstractUser de Django.
    Se pueden agregar campos adicionales según las necesidades del proyecto.
    """
    
    def __str__(self):
        return self.username