import socket
import urllib.error
import urllib.request
from urllib.parse import urljoin, urlsplit

from django.conf import settings

PROBE_TIMEOUT_SECONDS = 10
_BODY_SNIPPET_LIMIT = 2000


class ProbeHostNotAllowed(Exception):
    def __init__(self, host: str):
        self.host = host
        super().__init__(f"Host no permitido para pruebas: {host}")


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """No sigue redirecciones: una 3xx se reporta tal cual en vez de
    seguirse a un host fuera de la lista blanca (evita bypass de SSRF)."""

    def redirect_request(self, *args, **kwargs):
        return None


def resolve_probe_url(raw_url: str, request) -> str:
    """Convierte lo que el usuario escribió (una ruta relativa como
    "/api/v1/qa/" o una URL absoluta) en una URL completa, validando que su
    host esté en la lista blanca antes de permitir la petición saliente."""
    raw_url = (raw_url or "").strip()
    if not raw_url:
        raise ValueError("La URL no puede estar vacía.")

    if raw_url.startswith("/"):
        if request is not None:
            base = request.build_absolute_uri("/")
        else:
            base = "http://localhost/"
        return urljoin(base, raw_url)

    # El usuario suele pegar el dominio sin esquema (ej. "app.dominio.co/x");
    # se asume https en vez de exigirlo, siempre y cuando el host resultante
    # siga pasando la validación contra la lista blanca más abajo.
    if "://" not in raw_url:
        raw_url = f"https://{raw_url}"

    parts = urlsplit(raw_url)
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise ValueError(
            "La URL debe ser una ruta relativa o una URL http(s) completa."
        )

    allowed_hosts = {h.lower() for h in getattr(settings, "PROBE_ALLOWED_HOSTS", [])}
    if request is not None:
        allowed_hosts.add(request.get_host().split(":")[0].lower())

    if parts.hostname.lower() not in allowed_hosts:
        raise ProbeHostNotAllowed(parts.hostname)

    return raw_url


def probe_endpoint(url: str, authorization: str | None = None) -> dict:
    """Hace un GET de diagnóstico a `url` (ya validada) y normaliza el
    resultado. Nunca lanza: cualquier fallo de red se refleja en el dict."""
    headers = {"Accept": "application/json"}
    if authorization:
        headers["Authorization"] = authorization

    opener = urllib.request.build_opener(_NoRedirect)
    req = urllib.request.Request(url, headers=headers, method="GET")

    try:
        with opener.open(req, timeout=PROBE_TIMEOUT_SECONDS) as response:
            body = response.read(_BODY_SNIPPET_LIMIT).decode("utf-8", errors="replace")
            return {
                "status_code": response.status,
                "ok": 200 <= response.status < 300,
                "body_snippet": body,
                "network_error": None,
            }
    except urllib.error.HTTPError as exc:
        body = exc.read(_BODY_SNIPPET_LIMIT).decode("utf-8", errors="replace")
        return {
            "status_code": exc.code,
            "ok": False,
            "body_snippet": body,
            "network_error": None,
        }
    except (urllib.error.URLError, socket.timeout, TimeoutError) as exc:
        return {
            "status_code": None,
            "ok": False,
            "body_snippet": "",
            "network_error": str(exc.reason if hasattr(exc, "reason") else exc),
        }
