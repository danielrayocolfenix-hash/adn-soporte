"""Sondeo con navegador headless: a diferencia de `prober.py` (una simple
petición HTTP), esto abre la URL en un Chromium real para detectar errores
de JavaScript del lado del navegador que una petición HTTP nunca podría ver
(por ejemplo, una SPA que responde 200 pero falla al inicializarse por una
variable de entorno faltante)."""

NAVIGATION_TIMEOUT_MS = 20000
POST_LOAD_GRACE_MS = 1500


def probe_page(page, url: str) -> dict:
    """Navega `url` en una `page` de Playwright ya abierta y captura sus
    errores. Separado de `probe_with_browser` para poder reutilizar un
    mismo navegador ya lanzado (por ejemplo, en tests: lanzar un Chromium
    de sobra en cada prueba es lo que realmente cuesta tiempo, no navegar)."""
    from playwright.sync_api import Error as PlaywrightError

    console_errors: list[dict] = []
    page_errors: list[dict] = []

    def on_console(msg):
        if msg.type == "error":
            location = msg.location or {}
            console_errors.append(
                {
                    "message": msg.text,
                    "url": location.get("url", ""),
                    "line": location.get("lineNumber", location.get("line", 0)),
                }
            )

    def on_page_error(exc):
        page_errors.append(
            {
                "name": getattr(exc, "name", None) or "Error",
                "message": getattr(exc, "message", None) or str(exc),
                "stack": getattr(exc, "stack", "") or "",
            }
        )

    page.on("console", on_console)
    page.on("pageerror", on_page_error)

    try:
        response = page.goto(url, wait_until="load", timeout=NAVIGATION_TIMEOUT_MS)
    except PlaywrightError as exc:
        return {
            **_failure(str(exc)),
            "console_errors": console_errors,
            "page_errors": page_errors,
        }

    page.wait_for_timeout(POST_LOAD_GRACE_MS)
    status_code = response.status if response is not None else None
    is_healthy_status = bool(status_code and 200 <= status_code < 300)

    return {
        "status_code": status_code,
        "ok": is_healthy_status and not page_errors and not console_errors,
        "network_error": None,
        "console_errors": console_errors,
        "page_errors": page_errors,
    }


def probe_with_browser(url: str) -> dict:
    """Nunca lanza: cualquier fallo (navegador no instalado, timeout, DNS,
    etc.) se refleja en el dict devuelto, nunca como excepción."""
    try:
        from playwright.sync_api import Error as PlaywrightError
        from playwright.sync_api import sync_playwright
    except ImportError:
        return _failure(
            "El navegador headless (Playwright) no está instalado en este "
            "servidor. Ejecute `playwright install chromium`."
        )

    try:
        with sync_playwright() as playwright:
            try:
                browser = playwright.chromium.launch(headless=True)
            except PlaywrightError:
                return _failure(
                    "El navegador headless (Chromium) no está instalado en "
                    "este servidor. Ejecute `playwright install chromium`."
                )
            try:
                return probe_page(browser.new_page(), url)
            finally:
                browser.close()
    except Exception as exc:  # pragma: no cover - defensivo, no debe ocurrir
        return _failure(f"Fallo inesperado del navegador headless: {exc}")


def _failure(message: str) -> dict:
    return {
        "status_code": None,
        "ok": False,
        "network_error": message,
        "console_errors": [],
        "page_errors": [],
    }
