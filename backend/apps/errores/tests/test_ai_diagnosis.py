import json
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import httpx
import pytest

from apps.errores.infraestructure.services.ai_diagnosis import (
    AiDiagnosisUnavailable,
    generate_diagnosis,
)
from apps.errores.infraestructure.services.capture_service import capture_exception


def _raise_at_callsite():
    raise ValueError("algo falló con el id 123")


def _capture_group():
    try:
        _raise_at_callsite()
    except ValueError as exc:
        return capture_exception(exc, {"request": None})


DIAGNOSIS_PAYLOAD = {
    "causa_raiz": "El id no existe en la base de datos.",
    "solucion_sugerida": "Validar la existencia antes de operar sobre el objeto.",
    "codigo_sugerido": "if not Objeto.objects.filter(id=id).exists(): ...",
    "confianza": "media",
    "advertencia": "",
}


def _fake_response(stop_reason="end_turn", payload=None):
    text = json.dumps(payload if payload is not None else DIAGNOSIS_PAYLOAD)
    return SimpleNamespace(
        stop_reason=stop_reason,
        content=[SimpleNamespace(type="text", text=text)],
    )


@pytest.mark.django_db
def test_generate_diagnosis_sin_api_key_lanza_unavailable(settings):
    settings.ANTHROPIC_API_KEY = ""
    group = _capture_group()

    with pytest.raises(AiDiagnosisUnavailable):
        generate_diagnosis(group)


@pytest.mark.django_db
def test_generate_diagnosis_devuelve_json_parseado(settings):
    settings.ANTHROPIC_API_KEY = "fake-key"
    group = _capture_group()

    mock_client = MagicMock()
    mock_client.messages.create.return_value = _fake_response()

    with patch("anthropic.Anthropic", return_value=mock_client) as mock_ctor:
        result = generate_diagnosis(group)

    mock_ctor.assert_called_once_with(api_key="fake-key")
    assert result == DIAGNOSIS_PAYLOAD

    _, kwargs = mock_client.messages.create.call_args
    assert kwargs["model"] == "claude-opus-5"
    assert kwargs["output_config"]["format"]["type"] == "json_schema"


@pytest.mark.django_db
def test_generate_diagnosis_refusal_lanza_unavailable(settings):
    settings.ANTHROPIC_API_KEY = "fake-key"
    group = _capture_group()

    mock_client = MagicMock()
    mock_client.messages.create.return_value = _fake_response(stop_reason="refusal")

    with patch("anthropic.Anthropic", return_value=mock_client):
        with pytest.raises(AiDiagnosisUnavailable):
            generate_diagnosis(group)


@pytest.mark.django_db
def test_generate_diagnosis_api_error_lanza_unavailable(settings):
    settings.ANTHROPIC_API_KEY = "fake-key"
    group = _capture_group()

    import anthropic

    request = httpx.Request("POST", "https://api.anthropic.com/v1/messages")
    mock_client = MagicMock()
    mock_client.messages.create.side_effect = anthropic.APIError(
        "boom", request, body=None
    )

    with patch("anthropic.Anthropic", return_value=mock_client):
        with pytest.raises(AiDiagnosisUnavailable):
            generate_diagnosis(group)
