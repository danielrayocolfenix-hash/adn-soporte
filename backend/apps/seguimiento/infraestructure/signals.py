from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.qa.infraestructure.models.qa_model import QaModel


@receiver(post_save, sender=QaModel)
def crear_tarea_desde_qa(sender, instance: QaModel, created: bool, **kwargs) -> None:
    """Al registrar un QA, genera de inmediato su tarea vinculada en el
    tablero Kanban (columna "Hacer") para que un desarrollador la tome,
    dando trazabilidad entre la detección de QA y su resolución."""
    if not created:
        return

    from apps.seguimiento.infraestructure.models.tarea_model import TareaModel

    TareaModel.objects.create(
        titulo=instance.titulo,
        descripcion=instance.pasos_reproduccion,
        prioridad=instance.prioridad,
        responsable=instance.responsable,
        qa_origen=instance,
    )
