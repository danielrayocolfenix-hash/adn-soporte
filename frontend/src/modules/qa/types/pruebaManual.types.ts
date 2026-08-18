export type CasoPruebaEstado = "not_tested" | "pass" | "fail" | "blocked";

export interface CasoPrueba {
  id: string;
  suite: string | null;
  nombre: string;
  precondiciones: string;
  pasos: string;
  resultado_esperado: string;
  resultado_obtenido: string;
  estado: CasoPruebaEstado;
  qa_relacionado: string | null;
  qa_relacionado_titulo: string | null;
  responsable: number | null;
  responsable_nombre: string | null;
  created_at: string;
  updated_at: string;
}

export interface SuitePrueba {
  id: string;
  nombre: string;
  descripcion: string;
  casos: CasoPrueba[];
  total_casos: number;
  pass_count: number;
  fail_count: number;
  blocked_count: number;
  not_tested_count: number;
  porcentaje_exito: number | null;
  created_at: string;
  updated_at: string;
}

export interface SuitePruebaFormValues {
  nombre: string;
  descripcion: string;
}

export interface CasoPruebaFormValues {
  suite: string | null;
  nombre: string;
  precondiciones: string;
  pasos: string;
  resultado_esperado: string;
  qa_relacionado: string | null;
}
