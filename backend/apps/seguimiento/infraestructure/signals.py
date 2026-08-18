from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.qa.infraestructure.models.qa_model import QaModel
from apps.seguimiento.domain.services.qa_estado_mapper import mapear_estado_qa_a_tarea


@receiver(post_save, sender=QaModel)
def sincronizar_tarea_desde_qa(sender, instance: QaModel, created: bool, **kwargs) -> None:
    """Da trazabilidad entre la detección de QA y su resolución en el
    tablero Kanban: al registrar un QA genera su tarea vinculada (columna
    "Hacer") y, en cada cambio posterior del QA, mueve esa tarea a la
    columna que corresponde a su estado actual (ver `qa_estado_mapper`)."""
    from apps.seguimiento.infraestructure.models.tarea_model import TareaModel

    if created:
        TareaModel.objects.create(
            titulo=instance.titulo,
            descripcion=instance.pasos_reproduccion,
            prioridad=instance.prioridad,
            responsable=instance.responsable,
            qa_origen=instance,
            estado=mapear_estado_qa_a_tarea(instance.estado),
        )
        return

    nuevo_estado = mapear_estado_qa_a_tarea(instance.estado)
    for tarea in TareaModel.objects.filter(qa_origen=instance).exclude(estado=nuevo_estado):
        tarea.estado = nuevo_estado
        tarea.save(update_fields=["estado", "updated_at"])
