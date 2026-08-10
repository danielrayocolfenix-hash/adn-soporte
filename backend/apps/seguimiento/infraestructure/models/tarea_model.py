import uuid

from django.conf import settings
from django.db import models

from apps.seguimiento.domain.value_objects.estado import EstadoTarea
from apps.seguimiento.domain.value_objects.priority import Priority


class TareaModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, default="")
    rama_github = models.CharField(max_length=150, blank=True, default="")
    pr_url = models.URLField(blank=True, default="")
    fecha_limite = models.DateField(blank=True, null=True)
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="tareas"
    )
    qa_origen = models.ForeignKey(
        "qa.QaModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tareas_generadas",
    )
    prioridad = models.CharField(
        max_length=10, choices=[(p.value, p.name) for p in Priority], default=Priority.MEDIA.value
    )
    estado = models.CharField(
        max_length=20,
        choices=[(e.value, e.name) for e in EstadoTarea],
        default=EstadoTarea.HACER.value,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tareas"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.titulo
