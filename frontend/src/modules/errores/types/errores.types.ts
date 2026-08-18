export type ErrorNivel = "warning" | "error" | "critical";

export interface StackFrameContextLine {
  line: number;
  text: string;
}

export interface StackFrame {
  file: string;
  line: number;
  column: number | null;
  function: string;
  code_context: string;
  context_lines: StackFrameContextLine[];
  in_app: boolean;
}

export interface AiDiagnostico {
  causa_raiz: string;
  solucion_sugerida: string;
  codigo_sugerido: string;
  confianza: "alta" | "media" | "baja";
  advertencia: string;
}

/** Diagnóstico automático embebido en un QaRecord (categoría server_error). */
export interface ErrorDetalle {
  id: string;
  fingerprint: string;
  exception_type: string;
  mensaje: string;
  nivel: ErrorNivel;
  ambiente: "Development" | "Staging" | "Production";
  http_method: string;
  path: string;
  query_params: Record<string, unknown>;
  headers: Record<string, string>;
  usuario: number | null;
  usuario_nombre: string | null;
  ip_address: string | null;
  stack_frames: StackFrame[];
  stack_trace_text: string;
  count: number;
  first_seen: string;
  last_seen: string;
  ocurrencias_recientes: string[];
  qa_ticket: string | null;
  ai_diagnostico: AiDiagnostico | null;
  ai_diagnostico_en: string | null;
}

export interface ProbeResult {
  url: string;
  status_code: number | null;
  ok: boolean;
  body_snippet: string;
  network_error: string | null;
  error_group: ErrorDetalle | null;
  browser_error_group: ErrorDetalle | null;
  browser_probe_error: string | null;
}
