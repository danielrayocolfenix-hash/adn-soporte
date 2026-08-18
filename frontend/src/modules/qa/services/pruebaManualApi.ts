import { apiClient } from "@/shared/services/apiClient";
import type {
  CasoPrueba,
  CasoPruebaEstado,
  CasoPruebaFormValues,
  SuitePrueba,
  SuitePruebaFormValues,
} from "@/modules/qa/types/pruebaManual.types";

interface EnvelopeResponse<T> {
  data?: T;
  results?: T;
}

function unwrap<T>(data: EnvelopeResponse<T[]> | T[]): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return data.results ?? [];
}

export async function listSuites(): Promise<SuitePrueba[]> {
  const { data } = await apiClient.get<EnvelopeResponse<SuitePrueba[]> | SuitePrueba[]>(
    "/qa/suites/",
  );
  return unwrap(data);
}

export async function createSuite(values: SuitePruebaFormValues): Promise<SuitePrueba> {
  const { data } = await apiClient.post<SuitePrueba>("/qa/suites/", values);
  return data;
}

export async function deleteSuite(id: string): Promise<void> {
  await apiClient.delete(`/qa/suites/${id}/`);
}

export async function createCaso(values: CasoPruebaFormValues): Promise<CasoPrueba> {
  const { data } = await apiClient.post<CasoPrueba>("/qa/casos/", values);
  return data;
}

export async function updateCasoEstado(id: string, estado: CasoPruebaEstado): Promise<CasoPrueba> {
  const { data } = await apiClient.patch<CasoPrueba>(`/qa/casos/${id}/`, { estado });
  return data;
}

export async function updateCasoResultado(
  id: string,
  resultadoObtenido: string,
): Promise<CasoPrueba> {
  const { data } = await apiClient.patch<CasoPrueba>(`/qa/casos/${id}/`, {
    resultado_obtenido: resultadoObtenido,
  });
  return data;
}

export async function deleteCaso(id: string): Promise<void> {
  await apiClient.delete(`/qa/casos/${id}/`);
}
