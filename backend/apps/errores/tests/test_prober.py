import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request

from apps.errores.infraestructure.services.prober import (
    ProbeHostNotAllowed,
    probe_endpoint,
    resolve_probe_url,
)


class _Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == "/ok":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"success": true}')
        elif self.path == "/boom":
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"success": false, "error": {"message": "boom"}}')
        elif self.path == "/redirect":
            self.send_response(302)
            self.send_header("Location", "http://evil.example/steal")
            self.end_headers()


@pytest.fixture(scope="module")
def local_server():
    server = HTTPServer(("127.0.0.1", 0), _Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


def test_probe_endpoint_captura_respuesta_ok(local_server):
    result = probe_endpoint(f"{local_server}/ok")

    assert result["status_code"] == 200
    assert result["ok"] is True
    assert "success" in result["body_snippet"]
    assert result["network_error"] is None


def test_probe_endpoint_captura_error_500(local_server):
    result = probe_endpoint(f"{local_server}/boom")

    assert result["status_code"] == 500
    assert result["ok"] is False
    assert "boom" in result["body_snippet"]


def test_probe_endpoint_no_sigue_redirecciones(local_server):
    result = probe_endpoint(f"{local_server}/redirect")

    assert result["status_code"] == 302
    assert result["ok"] is False


def test_probe_endpoint_host_inexistente_no_lanza():
    result = probe_endpoint("http://127.0.0.1:1/no-existe")

    assert result["status_code"] is None
    assert result["ok"] is False
    assert result["network_error"]


def _request():
    # Sin HTTP_HOST explícito, APIRequestFactory usa "testserver", que el
    # entorno de pruebas de Django agrega automáticamente a ALLOWED_HOSTS.
    factory = APIRequestFactory()
    return Request(factory.get("/api/v1/qa/"))


def test_resolve_probe_url_ruta_relativa_usa_host_de_la_peticion():
    url = resolve_probe_url("/api/v1/qa/nope/", _request())
    assert url == "http://testserver/api/v1/qa/nope/"


def test_resolve_probe_url_host_propio_permitido_implicitamente(settings):
    settings.PROBE_ALLOWED_HOSTS = []
    url = resolve_probe_url("http://testserver/api/v1/qa/", _request())
    assert url == "http://testserver/api/v1/qa/"


def test_resolve_probe_url_host_en_lista_blanca_permitido(settings):
    settings.PROBE_ALLOWED_HOSTS = ["staging.example.com"]
    url = resolve_probe_url("https://staging.example.com/api/v1/qa/", _request())
    assert url == "https://staging.example.com/api/v1/qa/"


def test_resolve_probe_url_host_no_permitido_lanza(settings):
    settings.PROBE_ALLOWED_HOSTS = []
    with pytest.raises(ProbeHostNotAllowed):
        resolve_probe_url("https://evil.example/robar-datos", _request())


def test_resolve_probe_url_sin_esquema_asume_https(settings):
    settings.PROBE_ALLOWED_HOSTS = ["app.colfenixgps.co"]
    url = resolve_probe_url("app.colfenixgps.co/modulos/vision-ai", _request())
    assert url == "https://app.colfenixgps.co/modulos/vision-ai"


def test_resolve_probe_url_esquema_invalido_lanza():
    with pytest.raises(ValueError):
        resolve_probe_url("ftp://127.0.0.1/archivo", _request())


def test_resolve_probe_url_vacia_lanza():
    with pytest.raises(ValueError):
        resolve_probe_url("   ", _request())
