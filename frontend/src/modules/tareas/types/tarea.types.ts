export type TareaPrioridad = "alta" | "media" | "baja";

export type TareaEstado = "hacer" | "en_curso" | "en_proceso" | "terminado" | "cerrado";

export interface TareaRecord {
  id: string;
  titulo: string;
  descripcion: string;
  rama_github: string;
  pr_url: string;
  fecha_limite: string | null;
  responsable: number;
  responsable_nombre: string;
  prioridad: TareaPrioridad;
  estado: TareaEstado;
  qa_origen: string | null;
  qa_origen_titulo: string | null;
  created_at: string;
  updated_at: string;
}

export interface TareaFormValues {
  titulo: string;
  descripcion: string;
  rama_github: string;
  pr_url: string;
  fecha_limite: string;
  prioridad: TareaPrioridad;
}
