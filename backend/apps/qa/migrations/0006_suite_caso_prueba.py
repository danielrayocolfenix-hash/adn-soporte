import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("qa", "0005_qa_estado_reabierta_historial"),
    ]

    operations = [
        migrations.CreateModel(
            name="SuitePruebaModel",
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
                ("nombre", models.CharField(max_length=150)),
                ("descripcion", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "qa_suites_prueba",
                "ordering": ["nombre"],
            },
        ),
        migrations.CreateModel(
            name="CasoPruebaModel",
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
                ("nombre", models.CharField(max_length=200)),
                ("precondiciones", models.TextField(blank=True, default="")),
                ("pasos", models.TextField(blank=True, default="")),
                ("resultado_esperado", models.TextField(blank=True, default="")),
                ("resultado_obtenido", models.TextField(blank=True, default="")),
                (
                    "estado",
                    models.CharField(
                        choices=[
                            ("not_tested", "NOT_TESTED"),
                            ("pass", "PASS"),
                            ("fail", "FAIL"),
                            ("blocked", "BLOCKED"),
                        ],
                        default="not_tested",
                        max_length=15,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "qa_relacionado",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="casos_prueba_regresion",
                        to="qa.qamodel",
                    ),
                ),
                (
                    "responsable",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="casos_prueba",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "suite",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="casos",
                        to="qa.suitepruebamodel",
                    ),
                ),
            ],
            options={
                "db_table": "qa_casos_prueba",
                "ordering": ["-created_at"],
            },
        ),
    ]
