import linecache
import traceback

from apps.errores.infraestructure.services.fingerprint import is_in_app, relative_path

_CONTEXT_RADIUS = 6


def _context_lines(filename: str, lineno: int) -> list[dict]:
    linecache.checkcache(filename)
    lines = []
    for ln in range(max(1, lineno - _CONTEXT_RADIUS), lineno + _CONTEXT_RADIUS + 1):
        text = linecache.getline(filename, ln)
        if text:
            lines.append({"line": ln, "text": text.rstrip("\n")})
    return lines


def extract_frames(exc: BaseException) -> list[dict]:
    """Convierte el traceback en una lista estructurada de frames, marcando
    cuáles pertenecen al código del proyecto (`in_app`) para que la consola
    pueda señalar exactamente dónde ocurrió el error."""
    frames = []
    for frame_summary in traceback.extract_tb(exc.__traceback__):
        frames.append(
            {
                "file": relative_path(frame_summary.filename),
                "line": frame_summary.lineno,
                "column": getattr(frame_summary, "colno", None),
                "function": frame_summary.name,
                "code_context": (frame_summary.line or "").strip(),
                "context_lines": _context_lines(
                    frame_summary.filename, frame_summary.lineno
                ),
                "in_app": is_in_app(frame_summary.filename),
            }
        )
    return frames


def format_stack_text(exc: BaseException) -> str:
    return "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
