import uuid

from django.conf import settings
from django.db import models

from apps.qa.domain.value_objects.estado import EstadoQa


class QaEstadoHistorialModel(models.Model):
    """Auditoría de cada cambio de estado de un QA: qué estado tenía, a cuál
    pasó, cuándo y quién lo hizo (`None` cuando el cambio lo hizo el monitor
    automático, p.ej. una reapertura por regresión)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    qa = models.ForeignKey(
        "qa.QaModel", on_delete=models.CASCADE, related_name="historial_estados"
    )
    estado_anterior = models.CharField(
        max_length=25,
        choices=[(e.value, e.name) for e in EstadoQa],
        null=True,
        blank=True,
    )
    estado_nuevo = models.CharField(
        max_length=25, choices=[(e.value, e.name) for e in EstadoQa]
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "qa_estado_historial"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.qa_id}: {self.estado_anterior} -> {self.estado_nuevo}"
