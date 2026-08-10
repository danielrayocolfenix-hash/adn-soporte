from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APIRequestFactory

from apps.errores.infraestructure.models.error_model import ErrorGroupModel
from apps.errores.infraestructure.services.capture_service import capture_exception
from apps.errores.infraestructure.services.qa_link import SYSTEM_USERNAME
from apps.qa.infraestructure.models.qa_model import QaModel
from shared.presentation.exception_handler import custom_exception_handler

User = get_user_model()

NO_BROWSER_ERRORS = {
    "status_code": 200,
    "ok": True,
    "network_error": None,
    "console_errors": [],
    "page_errors": [],
}
BROWSER_PATH = "apps.errores.presentation.views.error_view.probe_with_browser"


def _raise_at_callsite_a():
    raise ValueError("algo falló con el id 123")


def _raise_at_callsite_b():
    raise ValueError("otra falla con el id 456")


def _capture(callsite, request=None):
    try:
        callsite()
    except ValueError as exc:
        return capture_exception(exc, {"request": request})


@pytest.fixture
def user(db):
    return User.objects.create_user(username="tester", password="pass1234")


@pytest.mark.django_db
def test_listar_errores_sin_autenticacion_devuelve_401():
    response = APIClient().get("/api/v1/errores/")

    assert response.status_code == 401
    assert response.data["success"] is False
    assert response.data["error"]["code"] == "UNAUTHENTICATED"


@pytest.mark.django_db
def test_dos_ocurrencias_mismo_callsite_incrementan_una_sola_fila():
    _capture(_raise_at_callsite_a)
    _capture(_raise_at_callsite_a)

    assert ErrorGroupModel.objects.count() == 1
    group = ErrorGroupModel.objects.get()
    assert group.count == 2


@pytest.mark.django_db
def test_callsites_distintos_crean_filas_separadas():
    _capture(_raise_at_callsite_a)
    _capture(_raise_at_callsite_b)

    assert ErrorGroupModel.objects.count() == 2
    fingerprints = set(ErrorGroupModel.objects.values_list("fingerprint", flat=True))
    assert len(fingerprints) == 2


@pytest.mark.django_db
def test_captura_sin_request_no_lanza_excepcion():
    group = _capture(_raise_at_callsite_a, request=None)

    assert group is not None
    assert group.path == ""
    assert group.http_method == ""


@pytest.mark.django_db
def test_nuevo_error_crea_y_vincula_ticket_qa_automaticamente():
    group = _capture(_raise_at_callsite_a)

    assert group.qa_ticket is not None
    assert group.qa_ticket.categoria == "server_error"
    assert group.qa_ticket.estado == "nueva"
    assert group.qa_ticket.codigo_error == str(group.id)


@pytest.mark.django_db
def test_recurrencia_no_crea_un_segundo_ticket_qa():
    group = _capture(_raise_at_callsite_a)
    ticket_id = group.qa_ticket_id

    group = _capture(_raise_at_callsite_a)

    assert QaModel.objects.count() == 1
    assert group.qa_ticket_id == ticket_id


@pytest.mark.django_db
def test_recurrencia_reabre_ticket_qa_ya_cerrado():
    group = _capture(_raise_at_callsite_a)
    group.qa_ticket.estado = "cerrada"
    group.qa_ticket.save(update_fields=["estado"])

    group = _capture(_raise_at_callsite_a)

    group.qa_ticket.refresh_from_db()
    assert group.qa_ticket.estado == "nueva"


@pytest.mark.django_db
def test_recurrencia_no_reabre_ticket_qa_activo():
    group = _capture(_raise_at_callsite_a)
    group.qa_ticket.estado = "en_proceso"
    group.qa_ticket.save(update_fields=["estado"])

    group = _capture(_raise_at_callsite_a)

    group.qa_ticket.refresh_from_db()
    assert group.qa_ticket.estado == "en_proceso"


@pytest.mark.django_db
def test_captura_sin_usuario_autenticado_usa_cuenta_de_sistema():
    factory = APIRequestFactory()
    from rest_framework.request import Request

    request = Request(factory.get("/api/v1/_debug/boom/"))

    group = _capture(_raise_at_callsite_a, request=request)

    assert group.qa_ticket.responsable.username == SYSTEM_USERNAME


@pytest.mark.django_db
def test_redacta_query_params_y_headers_sensibles():
    factory = APIRequestFactory()
    django_request = factory.get(
        "/api/v1/qa/?token=secreto123&modulo=qa",
        HTTP_AUTHORIZATION="Bearer secreto",
        HTTP_USER_AGENT="pytest",
    )
    from rest_framework.request import Request

    request = Request(django_request)

    group = _capture(_raise_at_callsite_a, request=request)

    assert group.query_params["token"] == "<redacted>"
    assert group.query_params["modulo"] == "qa"
    assert "Authorization" not in group.headers
    assert group.headers.get("User-Agent") == "pytest"


@pytest.mark.django_db
def test_exception_handler_captura_excepcion_no_controlada():
    factory = APIRequestFactory()
    from rest_framework.request import Request

    request = Request(factory.get("/api/v1/qa/"))

    response = custom_exception_handler(RuntimeError("boom"), {"request": request})

    assert response.status_code == 500
    assert response.data["error"]["code"] == "INTERNAL_SERVER_ERROR"
    assert ErrorGroupModel.objects.count() == 1
    assert QaModel.objects.count() == 1


@pytest.mark.django_db
def test_detalle_devuelve_envelope_success_data(user):
    group = _capture(_raise_at_callsite_a)
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get(f"/api/v1/errores/{group.id}/")

    assert response.status_code == 200
    assert response.data["success"] is True
    assert response.data["data"]["id"] == str(group.id)
    assert response.data["data"]["stack_frames"]


@pytest.mark.django_db
def test_qa_serializer_expone_error_detalle_del_ticket_vinculado(user):
    group = _capture(_raise_at_callsite_a)
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get(f"/api/v1/qa/{group.qa_ticket_id}/")

    assert response.status_code == 200
    assert response.data["categoria"] == "server_error"
    assert response.data["error_detalle"]["fingerprint"] == group.fingerprint
    assert response.data["error_detalle"]["stack_frames"]


@pytest.mark.django_db
def test_qa_manual_sin_error_vinculado_tiene_error_detalle_nulo(user):
    ticket = QaModel.objects.create(
        titulo="Reporte manual",
        categoria="qa_test",
        modulo="dashboard",
        resultado_esperado="x",
        responsable=user,
    )
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get(f"/api/v1/qa/{ticket.id}/")

    assert response.data["error_detalle"] is None


@pytest.mark.django_db
def test_filtros_de_listado(user):
    group_a = _capture(_raise_at_callsite_a)
    _capture(_raise_at_callsite_b)

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get("/api/v1/errores/", {"search": group_a.exception_type})
    assert len(response.data["data"]) == 2

    response = client.get("/api/v1/errores/", {"search": "456"})
    assert len(response.data["data"]) == 1


@pytest.mark.django_db
def test_probar_host_no_permitido_devuelve_400_sin_llamar_a_la_red(user, settings):
    settings.PROBE_ALLOWED_HOSTS = []
    client = APIClient()
    client.force_authenticate(user=user)

    view_path = "apps.errores.presentation.views.error_view.probe_endpoint"
    with patch(view_path) as mock_probe, patch(BROWSER_PATH) as mock_browser:
        response = client.post(
            "/api/v1/errores/probar/", {"url": "https://evil.example/robar"}
        )

    assert response.status_code == 400
    assert response.data["error"]["code"] == "PROBE_HOST_NOT_ALLOWED"
    mock_probe.assert_not_called()
    mock_browser.assert_not_called()


@pytest.mark.django_db
def test_probar_endpoint_propio_vincula_error_reciente_al_ticket(user):
    ticket = QaModel.objects.create(
        titulo="Falla al guardar",
        categoria="server_error",
        modulo="qa",
        codigo_error="/api/v1/qa/nope/",
        resultado_esperado="No debería fallar",
        responsable=user,
    )
    client = APIClient()
    client.force_authenticate(user=user)

    fake_result = {
        "status_code": 500,
        "ok": False,
        "body_snippet": "{}",
        "network_error": None,
    }
    captured = {}

    def fake_probe(url, authorization=None):
        # Simula lo que ocurriría de verdad: la petición saliente golpea
        # nuestro propio backend y el exception_handler captura el error
        # en ese instante (por eso `last_seen` queda después de `before`).
        captured["group"] = _capture(_raise_at_callsite_a)
        ErrorGroupModel.objects.filter(pk=captured["group"].pk).update(
            path="/api/v1/qa/nope/"
        )
        return fake_result

    view_path = "apps.errores.presentation.views.error_view.probe_endpoint"
    with patch(view_path, side_effect=fake_probe) as mock_probe, patch(
        BROWSER_PATH, return_value=NO_BROWSER_ERRORS
    ):
        response = client.post(
            "/api/v1/errores/probar/",
            {"url": "/api/v1/qa/nope/", "qa_ticket": str(ticket.id)},
        )

    assert response.status_code == 200
    mock_probe.assert_called_once()
    assert response.data["data"]["status_code"] == 500
    assert response.data["data"]["error_group"]["id"] == str(captured["group"].id)

    captured["group"].refresh_from_db()
    assert captured["group"].qa_ticket_id == ticket.id


@pytest.mark.django_db
def test_probar_sin_error_reciente_devuelve_error_group_nulo(user):
    client = APIClient()
    client.force_authenticate(user=user)

    fake_result = {
        "status_code": 200,
        "ok": True,
        "body_snippet": "{}",
        "network_error": None,
    }
    view_path = "apps.errores.presentation.views.error_view.probe_endpoint"
    with patch(view_path, return_value=fake_result), patch(
        BROWSER_PATH, return_value=NO_BROWSER_ERRORS
    ):
        response = client.post("/api/v1/errores/probar/", {"url": "/api/v1/qa/"})

    assert response.status_code == 200
    assert response.data["data"]["ok"] is True
    assert response.data["data"]["error_group"] is None
    assert response.data["data"]["browser_error_group"] is None


@pytest.mark.django_db
def test_probar_detecta_error_de_javascript_del_navegador(user, settings):
    settings.PROBE_ALLOWED_HOSTS = ["app.colfenixgps.co"]
    ticket = QaModel.objects.create(
        titulo="La app de mapas no carga",
        categoria="server_error",
        modulo="qa",
        codigo_error="https://app.colfenixgps.co/modulos/vision-ai",
        resultado_esperado="No debería fallar",
        responsable=user,
    )
    client = APIClient()
    client.force_authenticate(user=user)

    fake_http_result = {
        "status_code": 200,
        "ok": True,
        "body_snippet": "<html>...</html>",
        "network_error": None,
    }
    fake_browser_result = {
        "status_code": 200,
        "ok": False,
        "network_error": None,
        "console_errors": [],
        "page_errors": [
            {
                "name": "ReferenceError",
                "message": "VITE_FIREBASE_PROJECT_ID: Firebase Project ID es requerido",
                "stack": (
                    "ReferenceError: ...\n"
                    "    at https://app.colfenixgps.co/assets/env.js:47:11"
                ),
            }
        ],
    }

    http_path = "apps.errores.presentation.views.error_view.probe_endpoint"
    with patch(http_path, return_value=fake_http_result), patch(
        BROWSER_PATH, return_value=fake_browser_result
    ):
        response = client.post(
            "/api/v1/errores/probar/",
            {
                "url": "https://app.colfenixgps.co/modulos/vision-ai",
                "qa_ticket": str(ticket.id),
            },
        )

    assert response.status_code == 200
    browser_group = response.data["data"]["browser_error_group"]
    assert browser_group is not None
    assert browser_group["exception_type"] == "ReferenceError"
    assert "Firebase Project ID" in browser_group["mensaje"]
    assert browser_group["stack_frames"][0]["in_app"] is True

    ticket.refresh_from_db()
    assert ticket.errores_vinculados.filter(id=browser_group["id"]).exists()
