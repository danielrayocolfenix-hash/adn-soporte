import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("qa", "0003_remove_qamodel_descripcion_remove_qamodel_fecha_and_more"),
        ("seguimiento", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="tareamodel",
            name="qa_origen",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="tareas_generadas",
                to="qa.qamodel",
            ),
        ),
    ]
