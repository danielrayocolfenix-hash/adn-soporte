import type { QaEstado } from "@/modules/qa/types/qa.types";

export const ESTADO_ORDER: QaEstado[] = [
  "nueva",
  "reabierta",
  "en_proceso",
  "correccion",
  "pendiente_validacion",
  "validacion_final",
  "aprobada",
  "rechazada",
  "cerrada",
];

export const ESTADO_LABELS: Record<QaEstado, string> = {
  nueva: "Nueva",
  en_proceso: "En proceso",
  pendiente_validacion: "Pendiente validación",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  correccion: "Corrección",
  validacion_final: "Validación final",
  cerrada: "Cerrada",
  reabierta: "Reabierta (regresión)",
};

export const ESTADO_STYLES: Record<QaEstado, string> = {
  nueva: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  en_proceso: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  correccion: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  pendiente_validacion: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  validacion_final: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  aprobada: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rechazada: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  cerrada: "bg-slate-500/10 text-slate-500 dark:text-slate-500 border-slate-500/20",
  reabierta: "bg-rose-600/10 text-rose-700 dark:text-rose-400 border-rose-600/30",
};

export const ESTADOS_RESUELTOS: QaEstado[] = ["aprobada", "validacion_final", "cerrada"];
