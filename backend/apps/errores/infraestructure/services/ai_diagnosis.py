import json

from django.conf import settings

_SYSTEM_PROMPT = (
    "Eres un ingeniero de software senior ayudando a un equipo de QA a "
    "diagnosticar errores de servidor capturados automáticamente. A partir "
    "de la evidencia técnica que se te da (tipo de excepción, mensaje, "
    "stack trace y contexto de la petición), da un diagnóstico breve, "
    "concreto y accionable en español. No inventes detalles que no estén "
    "en la evidencia. Si la evidencia no alcanza para estar seguro, dilo "
    "explícitamente en 'advertencia' y baja el nivel de 'confianza'."
)

_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "causa_raiz": {
            "type": "string",
            "description": "Explicación breve de por qué ocurre el error.",
        },
        "solucion_sugerida": {
            "type": "string",
            "description": "Pasos concretos para solucionarlo.",
        },
        "codigo_sugerido": {
            "type": "string",
            "description": (
                "Fragmento de código ilustrando el arreglo. Cadena vacía si no aplica."
            ),
        },
        "confianza": {"type": "string", "enum": ["alta", "media", "baja"]},
        "advertencia": {
            "type": "string",
            "description": (
                "Aclaración si la evidencia es insuficiente o ambigua. "
                "Cadena vacía si no aplica."
            ),
        },
    },
    "required": [
        "causa_raiz",
        "solucion_sugerida",
        "codigo_sugerido",
        "confianza",
        "advertencia",
    ],
    "additionalProperties": False,
}

_STACK_TRACE_LIMIT = 8000


class AiDiagnosisUnavailable(Exception):
    """El diagnóstico no se pudo generar (config faltante o fallo del modelo).

    El mensaje es seguro para mostrar directamente al usuario.
    """


def _describe_origin(group) -> str:
    if group.fingerprint.startswith("browser::"):
        return "un error de JavaScript en el navegador (frontend)"
    return "una excepción de Python en el backend"


def _build_user_prompt(group) -> str:
    return (
        f"Origen: {_describe_origin(group)}\n"
        f"Ambiente: {group.ambiente}\n"
        f"Ruta: {group.http_method} {group.path}\n"
        f"Tipo de excepción: {group.exception_type}\n"
        f"Mensaje: {group.mensaje}\n"
        f"Ocurrencias: {group.count} "
        f"(primera vez: {group.first_seen}, última vez: {group.last_seen})\n\n"
        f"Stack trace:\n{group.stack_trace_text[:_STACK_TRACE_LIMIT]}"
    )


def generate_diagnosis(group) -> dict:
    """Pide a Claude un diagnóstico (causa raíz + solución sugerida) para
    este grupo de errores. Nunca modifica código ni ejecuta nada: es una
    sola llamada de análisis de texto, cuyo resultado el equipo revisa
    antes de aplicar cualquier cambio."""
    api_key = getattr(settings, "ANTHROPIC_API_KEY", "")
    if not api_key:
        raise AiDiagnosisUnavailable(
            "El diagnóstico con IA no está configurado en este servidor "
            "(falta ANTHROPIC_API_KEY)."
        )

    import anthropic

    client = anthropic.Anthropic(api_key=api_key)

    try:
        response = client.messages.create(
            model="claude-opus-5",
            max_tokens=4096,
            system=_SYSTEM_PROMPT,
            output_config={
                "effort": "medium",
                "format": {"type": "json_schema", "schema": _OUTPUT_SCHEMA},
            },
            messages=[{"role": "user", "content": _build_user_prompt(group)}],
        )
    except anthropic.APIError as exc:
        raise AiDiagnosisUnavailable(
            "No fue posible contactar al servicio de IA. Intente de nuevo."
        ) from exc

    if response.stop_reason == "refusal":
        raise AiDiagnosisUnavailable(
            "El modelo no pudo generar un diagnóstico para este error."
        )

    text = next(
        (block.text for block in response.content if block.type == "text"), None
    )
    if text is None:
        raise AiDiagnosisUnavailable("El modelo no devolvió una respuesta utilizable.")

    return json.loads(text)
