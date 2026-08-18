import uuid

from django.conf import settings
from django.db import models

from apps.qa.domain.value_objects.estado_caso_prueba import EstadoCasoPrueba


class CasoPruebaModel(models.Model):
    """Un caso de prueba manual: nombre, precondiciones, pasos, resultado
    esperado/obtenido y su estado (PASS/FAIL/BLOCKED/NOT_TESTED). Puede
    pertenecer a una suite y, cuando existe para verificar que un QA
    (típicamente un error) no vuelva a ocurrir, se vincula como prueba de
    regresión de ese QA."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    suite = models.ForeignKey(
        "qa.SuitePruebaModel",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="casos",
    )
    nombre = models.CharField(max_length=200)
    precondiciones = models.TextField(blank=True, default="")
    pasos = models.TextField(blank=True, default="")
    resultado_esperado = models.TextField(blank=True, default="")
    resultado_obtenido = models.TextField(blank=True, default="")
    estado = models.CharField(
        max_length=15,
        choices=[(e.value, e.name) for e in EstadoCasoPrueba],
        default=EstadoCasoPrueba.NOT_TESTED.value,
    )
    qa_relacionado = models.ForeignKey(
        "qa.QaModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="casos_prueba_regresion",
    )
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="casos_prueba",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "qa_casos_prueba"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.nombre
