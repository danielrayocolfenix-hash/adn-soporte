import uuid

from django.conf import settings
from django.db import models

from apps.errores.domain.value_objects.ambiente import AMBIENTE_CHOICES
from apps.errores.domain.value_objects.nivel import NivelError

OCURRENCIAS_RECIENTES_MAX = 100


def append_occurrence(existing: list[str], when) -> list[str]:
    """Agrega `when` (datetime) a la lista de ocurrencias recientes,
    recortando las más antiguas si excede el máximo."""
    updated = [*existing, when.isoformat()]
    return updated[-OCURRENCIAS_RECIENTES_MAX:]


class ErrorGroupModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Identidad / agrupación
    fingerprint = models.CharField(max_length=64, unique=True)
    exception_type = models.CharField(max_length=255)
    mensaje = models.TextField(blank=True, default="")

    # Clasificación
    nivel = models.CharField(
        max_length=10,
        choices=[(n.value, n.name) for n in NivelError],
        default=NivelError.ERROR.value,
    )
    ambiente = models.CharField(
        max_length=20, choices=AMBIENTE_CHOICES, default="Development"
    )

    # Contexto de la última ocurrencia
    http_method = models.CharField(max_length=10, blank=True, default="")
    path = models.CharField(max_length=500, blank=True, default="")
    query_params = models.JSONField(default=dict, blank=True)
    headers = models.JSONField(default=dict, blank=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="errores_reportados",
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # Stack trace de la última ocurrencia
    stack_frames = models.JSONField(default=list, blank=True)
    stack_trace_text = models.TextField(blank=True, default="")

    # Agregación
    count = models.PositiveIntegerField(default=1)
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField()
    # Marca de tiempo de cada una de las últimas ocurrencias (recortada a
    # OCURRENCIAS_RECIENTES_MAX), para ver la tendencia en el tiempo sin
    # necesitar una tabla de ocurrencias aparte.
    ocurrencias_recientes = models.JSONField(default=list, blank=True)

    # Ticket QA creado automáticamente al capturar la primera ocurrencia. La
    # triage (estado, causa raíz, solución) vive en ese ticket, no aquí:
    # este modelo es solo la evidencia técnica (traza, contexto, conteo).
    qa_ticket = models.ForeignKey(
        "qa.QaModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="errores_vinculados",
    )

    # Diagnóstico generado bajo demanda por IA (ver ai_diagnosis.py). Se
    # guarda en caché aquí para no volver a llamar a la API cada vez que se
    # abre el ticket; el usuario puede pedir "Regenerar" explícitamente.
    ai_diagnostico = models.JSONField(null=True, blank=True)
    ai_diagnostico_en = models.DateTimeField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "errores_grupos"
        ordering = ["-last_seen"]
        indexes = [
            models.Index(fields=["-last_seen"], name="errores_last_seen_idx"),
            models.Index(fields=["ambiente"], name="errores_ambiente_idx"),
            models.Index(fields=["nivel"], name="errores_nivel_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.exception_type}: {self.path}"
