SENSITIVE_KEYS = {
    "password",
    "pass",
    "pwd",
    "token",
    "secret",
    "key",
    "authorization",
    "access_token",
    "refresh_token",
    "csrf",
    "csrfmiddlewaretoken",
    "api_key",
}

SAFE_HEADERS = {
    "Content-Type",
    "User-Agent",
    "Accept",
    "Accept-Language",
    "Referer",
    "X-Requested-With",
}


def redact_query_params(params: dict) -> dict:
    return {
        key: ("<redacted>" if key.lower() in SENSITIVE_KEYS else value)
        for key, value in params.items()
    }


def safe_headers(request) -> dict:
    return {
        name: value for name, value in request.headers.items() if name in SAFE_HEADERS
    }


def client_ip(request) -> str | None:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
