import hashlib
import re
import traceback
from pathlib import Path

from django.conf import settings

_UUID_RE = re.compile(
    r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
)
_NUM_RE = re.compile(r"\b\d+\b")
_QUOTED_RE = re.compile(r"'[^']*'|\"[^\"]*\"")

_IN_APP_ROOTS = {"apps", "shared", "config"}


def normalize_message(message: str) -> str:
    """Reemplaza valores variables (uuids, números, literales citados) por
    marcadores, para que el mismo error con datos distintos agrupe igual."""
    message = _UUID_RE.sub("<uuid>", message)
    message = _QUOTED_RE.sub("<s>", message)
    message = _NUM_RE.sub("<n>", message)
    return message.strip()[:300]


def exception_type_name(exc: BaseException) -> str:
    module = type(exc).__module__
    qualname = type(exc).__qualname__
    return qualname if module == "builtins" else f"{module}.{qualname}"


def is_in_app(filename: str) -> bool:
    try:
        rel = Path(filename).resolve().relative_to(settings.BASE_DIR)
    except ValueError:
        return False
    return bool(rel.parts) and rel.parts[0] in _IN_APP_ROOTS


def relative_path(filename: str) -> str:
    try:
        rel = Path(filename).resolve().relative_to(settings.BASE_DIR)
        return str(rel).replace("\\", "/")
    except ValueError:
        return filename.replace("\\", "/")


def compute_fingerprint(exc: BaseException) -> str:
    """Agrupa recurrencias de "el mismo" error: mismo tipo de excepción,
    mismo punto de código de aplicación donde ocurrió (buscando el frame más
    interno perteneciente al proyecto, no a librerías) y mensaje normalizado.

    Nota: incluir el número de línea significa que un cambio de código que
    desplace líneas por encima del error puede iniciar un grupo "nuevo" tras
    un deploy, en vez de seguir acumulando en el mismo. Es un costo aceptable
    para una herramienta de este tamaño; no se pierde información, solo se
    reinicia el contador de ese punto.
    """
    frames = traceback.extract_tb(exc.__traceback__)
    app_frame = next((f for f in reversed(frames) if is_in_app(f.filename)), None)
    frame = app_frame or (frames[-1] if frames else None)

    exc_type = exception_type_name(exc)
    norm_msg = normalize_message(str(exc))

    if frame is None:
        source = f"{exc_type}::<no-frame>::{norm_msg}"
    else:
        source = (
            f"{exc_type}::{relative_path(frame.filename)}:{frame.name}:{frame.lineno}::"
            f"{norm_msg}"
        )

    return hashlib.sha256(source.encode("utf-8")).hexdigest()
