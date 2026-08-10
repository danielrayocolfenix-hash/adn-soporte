import pytest
from django.contrib.auth import get_user_model

from apps.errores.infraestructure.models.error_model import ErrorGroupModel
from apps.errores.infraestructure.services.browser_capture import capture_browser_errors
from apps.qa.infraestructure.models.qa_model import QaModel

User = get_user_model()

_PAGE_ERROR = [
    {
        "name": "ReferenceError",
        "message": "VITE_FIREBASE_PROJECT_ID: Firebase Project ID es requerido",
        "stack": "ReferenceError: ...\n    at https://app.colfenixgps.co/env.js:47:11",
    }
]
_OTHER_PAGE_ERROR = [
    {"name": "TypeError", "message": "Cannot read properties of undefined", "stack": ""}
]


@pytest.fixture
def user(db):
    return User.objects.create_user(username="tester", password="pass1234")


@pytest.mark.django_db
def test_sin_errores_no_captura_nada():
    group = capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=[],
    )

    assert group is None
    assert ErrorGroupModel.objects.count() == 0


@pytest.mark.django_db
def test_captura_crea_grupo_y_ticket_qa_vinculado(user):
    group = capture_browser_errors(
        url="https://app.colfenixgps.co/modulos/vision-ai",
        path="/modulos/vision-ai",
        console_errors=[],
        page_errors=_PAGE_ERROR,
        triggered_by=user,
    )

    assert group is not None
    assert group.exception_type == "ReferenceError"
    assert "Firebase" in group.mensaje
    assert group.stack_frames[0]["in_app"] is True
    assert group.qa_ticket is not None
    assert group.qa_ticket.categoria == "server_error"
    assert group.qa_ticket.responsable == user


@pytest.mark.django_db
def test_misma_url_y_mensaje_incrementan_el_mismo_grupo(user):
    capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=_PAGE_ERROR,
        triggered_by=user,
    )
    group = capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=_PAGE_ERROR,
        triggered_by=user,
    )

    assert ErrorGroupModel.objects.count() == 1
    assert group.count == 2


@pytest.mark.django_db
def test_mismo_path_distinto_mensaje_crea_grupos_separados(user):
    capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=_PAGE_ERROR,
        triggered_by=user,
    )
    capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=_OTHER_PAGE_ERROR,
        triggered_by=user,
    )

    assert ErrorGroupModel.objects.count() == 2


@pytest.mark.django_db
def test_recurrencia_reabre_ticket_qa_cerrado(user):
    group = capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=_PAGE_ERROR,
        triggered_by=user,
    )
    group.qa_ticket.estado = "cerrada"
    group.qa_ticket.save(update_fields=["estado"])

    group = capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[],
        page_errors=_PAGE_ERROR,
        triggered_by=user,
    )

    group.qa_ticket.refresh_from_db()
    assert group.qa_ticket.estado == "nueva"


@pytest.mark.django_db
def test_solo_console_error_usa_tipo_generico(user):
    console_error = {
        "message": "algo falló",
        "url": "https://app.colfenixgps.co/x",
        "line": 1,
    }
    group = capture_browser_errors(
        url="https://app.colfenixgps.co/x",
        path="/x",
        console_errors=[console_error],
        page_errors=[],
        triggered_by=user,
    )

    assert group.exception_type == "ConsoleError"
    assert QaModel.objects.filter(id=group.qa_ticket_id).exists()
