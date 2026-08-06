import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_listar_qa_sin_autenticacion_devuelve_401():
    response = APIClient().get("/api/v1/qa/")

    assert response.status_code == 401
    assert response.data["success"] is False
    assert response.data["error"]["code"] == "UNAUTHENTICATED"
