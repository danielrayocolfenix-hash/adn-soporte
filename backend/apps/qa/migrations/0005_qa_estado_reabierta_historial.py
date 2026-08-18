import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("qa", "0004_qamodel_codigo_error_alter_qamodel_categoria"),
    ]

    operations = [
        migrations.AddField(
            model_name="qamodel",
            name="veces_reabierto",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="qamodel",
            name="estado",
            field=models.CharField(
                choices=[
                    ("nueva", "NUEVA"),
                    ("en_proceso", "EN_PROCESO"),
                    ("pendiente_validacion", "PENDIENTE_VALIDACION"),
                    ("aprobada", "APROBADA"),
                    ("rechazada", "RECHAZADA"),
                    ("correccion", "CORRECCION"),
                    ("validacion_final", "VALIDACION_FINAL"),
                    ("cerrada", "CERRADA"),
                    ("reabierta", "REABIERTA"),
                ],
                default="nueva",
                max_length=25,
            ),
        ),
        migrations.CreateModel(
            name="QaEstadoHistorialModel",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "estado_anterior",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("nueva", "NUEVA"),
                            ("en_proceso", "EN_PROCESO"),
                            ("pendiente_validacion", "PENDIENTE_VALIDACION"),
                            ("aprobada", "APROBADA"),
                            ("rechazada", "RECHAZADA"),
                            ("correccion", "CORRECCION"),
                            ("validacion_final", "VALIDACION_FINAL"),
                            ("cerrada", "CERRADA"),
                            ("reabierta", "REABIERTA"),
                        ],
                        max_length=25,
                        null=True,
                    ),
                ),
                (
                    "estado_nuevo",
                    models.CharField(
                        choices=[
                            ("nueva", "NUEVA"),
                            ("en_proceso", "EN_PROCESO"),
                            ("pendiente_validacion", "PENDIENTE_VALIDACION"),
                            ("aprobada", "APROBADA"),
                            ("rechazada", "RECHAZADA"),
                            ("correccion", "CORRECCION"),
                            ("validacion_final", "VALIDACION_FINAL"),
                            ("cerrada", "CERRADA"),
                            ("reabierta", "REABIERTA"),
                        ],
                        max_length=25,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "qa",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="historial_estados",
                        to="qa.qamodel",
                    ),
                ),
                (
                    "usuario",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "qa_estado_historial",
                "ordering": ["-created_at"],
            },
        ),
    ]
