from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("qa", "0003_remove_qamodel_descripcion_remove_qamodel_fecha_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="qamodel",
            name="codigo_error",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
        migrations.AlterField(
            model_name="qamodel",
            name="categoria",
            field=models.CharField(
                choices=[
                    ("ui_design", "Diseño / UI"),
                    ("ux_flow", "Comportamiento / UX"),
                    ("qa_test", "Prueba Manual QA"),
                    ("server_error", "Error de Servidor / Sistema"),
                ],
                default="qa_test",
                max_length=20,
            ),
        ),
    ]
