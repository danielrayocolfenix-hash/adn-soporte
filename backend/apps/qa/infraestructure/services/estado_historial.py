def registrar_cambio_estado(qa, estado_anterior: str, estado_nuevo: str, usuario=None) -> None:
    """Deja constancia en `QaEstadoHistorialModel` de una transición de
    estado. `usuario=None` indica que el cambio lo hizo el monitor
    automático (p.ej. una reapertura por regresión), no una persona."""
    if estado_anterior == estado_nuevo:
        return

    from apps.qa.infraestructure.models.qa_estado_historial_model import (
        QaEstadoHistorialModel,
    )

    QaEstadoHistorialModel.objects.create(
        qa=qa,
        estado_anterior=estado_anterior,
        estado_nuevo=estado_nuevo,
        usuario=usuario,
    )
