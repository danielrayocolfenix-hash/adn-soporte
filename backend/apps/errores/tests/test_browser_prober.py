import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

from apps.errores.infraestructure.services.browser_prober import probe_page

_OK_PAGE = b"<html><body>todo bien</body></html>"
_CONSOLE_ERROR_PAGE = (
    b"<html><body><script>console.error('fallo de consola')</script></body></html>"
)
_THROW_PAGE = (
    b"<html><body><script>"
    b"function initFirebase() { throw new ReferenceError('FIREBASE_ID requerido'); }"
    b"initFirebase();"
    b"</script></body></html>"
)


class _Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        pages = {
            "/ok": _OK_PAGE,
            "/console-error": _CONSOLE_ERROR_PAGE,
            "/throw": _THROW_PAGE,
        }
        body = pages.get(self.path)
        if body is None:
            self.send_response(404)
            self.end_headers()
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(body)


@pytest.fixture(scope="module")
def local_server():
    server = HTTPServer(("127.0.0.1", 0), _Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


@pytest.fixture(scope="module")
def browser():
    """Un solo Chromium para todo el módulo: lanzar el navegador es lo que
    cuesta tiempo, no navegar, así que evitamos relanzarlo por prueba."""
    from playwright.sync_api import sync_playwright

    with sync_playwright() as playwright:
        instance = playwright.chromium.launch(headless=True)
        yield instance
        instance.close()


def test_probe_page_pagina_sana_no_reporta_errores(local_server, browser):
    result = probe_page(browser.new_page(), f"{local_server}/ok")

    assert result["status_code"] == 200
    assert result["ok"] is True
    assert result["console_errors"] == []
    assert result["page_errors"] == []
    assert result["network_error"] is None


def test_probe_page_captura_console_error(local_server, browser):
    result = probe_page(browser.new_page(), f"{local_server}/console-error")

    assert result["ok"] is False
    assert len(result["console_errors"]) == 1
    assert "fallo de consola" in result["console_errors"][0]["message"]


def test_probe_page_captura_excepcion_no_atrapada(local_server, browser):
    result = probe_page(browser.new_page(), f"{local_server}/throw")

    assert result["ok"] is False
    assert len(result["page_errors"]) == 1
    page_error = result["page_errors"][0]
    assert page_error["name"] == "ReferenceError"
    assert "FIREBASE_ID requerido" in page_error["message"]
    assert "initFirebase" in page_error["stack"]


def test_probe_page_host_inalcanzable_no_lanza(browser):
    result = probe_page(browser.new_page(), "http://127.0.0.1:1/no-existe")

    assert result["status_code"] is None
    assert result["ok"] is False
    assert result["network_error"]
