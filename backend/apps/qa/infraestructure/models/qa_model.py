import uuid

from django.conf import settings
from django.db import models

from apps.qa.domain.value_objects.estado import EstadoQa
from apps.qa.domain.value_objects.priority import Priority

CATEGORIA_CHOICES = [
    ("ui_design", "Diseño / UI"),
    ("ux_flow", "Comportamiento / UX"),
    ("qa_test", "Prueba Manual QA"),
    ("server_error", "Error de Servidor / Sistema"),
]

AMBIENTE_CHOICES = [
    ("Development", "Development"),
    ("Staging", "Staging"),
    ("Production", "Production"),
]


class QaModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=255)
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default="qa_test")
    modulo = models.CharField(max_length=100)
    ambiente = models.CharField(max_length=20, choices=AMBIENTE_CHOICES, default="Staging")
    figma_url = models.URLField(blank=True, default="")
    device_or_browser = models.CharField(max_length=150, blank=True, default="")
    codigo_error = models.CharField(max_length=50, blank=True, default="")
    pasos_reproduccion = models.TextField(blank=True, default="")
    resultado_esperado = models.TextField(blank=True, default="")
    resultado_obtenido = models.TextField(blank=True, default="")
    imagen_antes = models.ImageField(upload_to="qa/antes/%Y/%m/", blank=True, null=True)
    imagen_despues = models.ImageField(upload_to="qa/despues/%Y/%m/", blank=True, null=True)
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="pruebas_qa"
    )
    prioridad = models.CharField(
        max_length=10, choices=[(p.value, p.name) for p in Priority], default=Priority.MEDIA.value
    )
    estado = models.CharField(
        max_length=25,
        choices=[(e.value, e.name) for e in EstadoQa],
        default=EstadoQa.NUEVA.value,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "qa_pruebas"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.titulo
