import type { CasoPruebaEstado } from "@/modules/qa/types/pruebaManual.types";

export const CASO_ESTADO_ORDER: CasoPruebaEstado[] = ["not_tested", "pass", "fail", "blocked"];

export const CASO_ESTADO_LABELS: Record<CasoPruebaEstado, string> = {
  not_tested: "Sin probar",
  pass: "Pass",
  fail: "Fail",
  blocked: "Blocked",
};

export const CASO_ESTADO_STYLES: Record<CasoPruebaEstado, string> = {
  not_tested: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  pass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  fail: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  blocked: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export const CASO_ESTADO_BAR_STYLES: Record<CasoPruebaEstado, string> = {
  not_tested: "bg-slate-400",
  pass: "bg-emerald-500",
  fail: "bg-rose-500",
  blocked: "bg-amber-500",
};
