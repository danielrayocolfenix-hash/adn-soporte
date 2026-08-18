import uuid

from django.db import models


class SuitePruebaModel(models.Model):
    """Agrupa casos de prueba manuales relacionados (p.ej. "SUITE: CLIENTES"),
    para poder ejecutarlos y medir el % de éxito como conjunto."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "qa_suites_prueba"
        ordering = ["nombre"]

    def __str__(self) -> str:
        return self.nombre
