import { apiClient } from "@/shared/services/apiClient";
import type { TareaEstado, TareaFormValues, TareaRecord } from "@/modules/tareas/types/tarea.types";

interface EnvelopeResponse<T> {
  data?: T;
  results?: T;
}

function toPayload(values: TareaFormValues) {
  return {
    titulo: values.titulo,
    descripcion: values.descripcion,
    rama_github: values.rama_github,
    pr_url: values.pr_url,
    fecha_limite: values.fecha_limite || null,
    prioridad: values.prioridad,
  };
}

export async function listTareas(): Promise<TareaRecord[]> {
  const { data } = await apiClient.get<EnvelopeResponse<TareaRecord[]> | TareaRecord[]>("/tareas/");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return data.results ?? [];
}

export async function getTarea(id: string): Promise<TareaRecord> {
  const { data } = await apiClient.get<TareaRecord>(`/tareas/${id}/`);
  return data;
}

export async function createTarea(values: TareaFormValues): Promise<TareaRecord> {
  const { data } = await apiClient.post<TareaRecord>("/tareas/", toPayload(values));
  return data;
}

export async function updateTarea(id: string, values: TareaFormValues): Promise<TareaRecord> {
  const { data } = await apiClient.patch<TareaRecord>(`/tareas/${id}/`, toPayload(values));
  return data;
}

export async function updateTareaEstado(id: string, estado: TareaEstado): Promise<TareaRecord> {
  const { data } = await apiClient.patch<TareaRecord>(`/tareas/${id}/`, { estado });
  return data;
}

export async function deleteTarea(id: string): Promise<void> {
  await apiClient.delete(`/tareas/${id}/`);
}
