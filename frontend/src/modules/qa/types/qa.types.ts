import type { ErrorDetalle } from "@/modules/errores/types/errores.types";

export type NewReportCategory = "ui_design" | "ux_flow" | "qa_test" | "server_error";

export type QaAmbiente = "Development" | "Staging" | "Production";

export type QaPrioridad = "alta" | "media" | "baja";

export type QaEstado =
  | "nueva"
  | "en_proceso"
  | "pendiente_validacion"
  | "aprobada"
  | "rechazada"
  | "correccion"
  | "validacion_final"
  | "cerrada"
  | "reabierta";

export interface ReproductionStep {
  id: string;
  step: string;
}

export interface QaEstadoHistorialEntry {
  estado_anterior: QaEstado | null;
  estado_nuevo: QaEstado;
  usuario_nombre: string | null;
  created_at: string;
}

export interface CasoPruebaRegresionResumen {
  id: string;
  nombre: string;
  estado: string;
}

export interface QaRecord {
  id: string;
  titulo: string;
  categoria: NewReportCategory;
  modulo: string;
  ambiente: QaAmbiente;
  figma_url: string;
  device_or_browser: string;
  codigo_error: string;
  pasos_reproduccion: string;
  resultado_esperado: string;
  resultado_obtenido: string;
  imagen_antes: string | null;
  imagen_despues: string | null;
  responsable: number;
  responsable_nombre: string;
  prioridad: QaPrioridad;
  estado: QaEstado;
  veces_reabierto: number;
  historial_estados: QaEstadoHistorialEntry[];
  casos_prueba_regresion: CasoPruebaRegresionResumen[];
  error_detalle: ErrorDetalle | null;
  created_at: string;
  updated_at: string;
}

export interface QaFormValues {
  titulo: string;
  categoria: NewReportCategory;
  modulo: string;
  ambiente: QaAmbiente;
  figma_url: string;
  device_or_browser: string;
  codigo_error: string;
  resultado_esperado: string;
  resultado_obtenido: string;
  prioridad: QaPrioridad;
  imagenAntes: File | null;
  imagenDespues: File | null;
}

export interface ExecutionRecord {
  id: string;
  suiteName: string;
  environment: string;
  triggerType: "auto" | "manual";
  triggeredBy: string;
  duration: string;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  status: "passed" | "failed" | "aborted";
  timestamp: string;
}
