from typing import Any

from rest_framework.response import Response


def success_response(
    data: Any = None, status_code: int = 200, meta: dict | None = None
) -> Response:
    body: dict[str, Any] = {"success": True, "data": data, "error": None}
    if meta is not None:
        body["meta"] = meta
    return Response(body, status=status_code)


def error_response(
    message: str,
    status_code: int = 400,
    internal_code: str = "ERROR",
    action: str | None = None,
    retry: bool = False,
) -> Response:
    body = {
        "success": False,
        "data": None,
        "error": {
            "code": internal_code,
            "message": message,
            "action": action,
            "retry": retry,
        },
    }
    return Response(body, status=status_code)
