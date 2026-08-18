import { apiClient } from "@/shared/services/apiClient";
import type { QaEstado, QaFormValues, QaRecord } from "@/modules/qa/types/qa.types";

function toFormData(values: QaFormValues, pasosReproduccion: string): FormData {
  const formData = new FormData();
  formData.append("titulo", values.titulo);
  formData.append("categoria", values.categoria);
  formData.append("modulo", values.modulo);
  formData.append("ambiente", values.ambiente);
  formData.append("figma_url", values.figma_url);
  formData.append("device_or_browser", values.device_or_browser);
  formData.append("codigo_error", values.codigo_error);
  formData.append("resultado_esperado", values.resultado_esperado);
  formData.append("resultado_obtenido", values.resultado_obtenido);
  formData.append("prioridad", values.prioridad);
  formData.append("pasos_reproduccion", pasosReproduccion);
  if (values.imagenAntes) formData.append("imagen_antes", values.imagenAntes);
  if (values.imagenDespues) formData.append("imagen_despues", values.imagenDespues);
  return formData;
}

interface EnvelopeResponse<T> {
  data?: T;
  results?: T;
}

export async function listQa(): Promise<QaRecord[]> {
  const { data } = await apiClient.get<EnvelopeResponse<QaRecord[]> | QaRecord[]>("/qa/");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return data.results ?? [];
}

export async function getQa(id: string): Promise<QaRecord> {
  const { data } = await apiClient.get<QaRecord>(`/qa/${id}/`);
  return data;
}

export async function createQa(values: QaFormValues, pasosReproduccion: string): Promise<QaRecord> {
  const { data } = await apiClient.post<QaRecord>("/qa/", toFormData(values, pasosReproduccion), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateQa(
  id: string,
  values: QaFormValues,
  pasosReproduccion: string,
): Promise<QaRecord> {
  const { data } = await apiClient.patch<QaRecord>(
    `/qa/${id}/`,
    toFormData(values, pasosReproduccion),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function updateQaSolucion(id: string, resultadoObtenido: string): Promise<QaRecord> {
  const { data } = await apiClient.patch<QaRecord>(`/qa/${id}/`, {
    resultado_obtenido: resultadoObtenido,
  });
  return data;
}

export async function updateQaEstado(id: string, estado: QaEstado): Promise<QaRecord> {
  const { data } = await apiClient.patch<QaRecord>(`/qa/${id}/`, { estado });
  return data;
}

export async function deleteQa(id: string): Promise<void> {
  await apiClient.delete(`/qa/${id}/`);
}
