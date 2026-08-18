import { apiClient } from "@/shared/services/apiClient";
import type { ErrorDetalle } from "@/modules/errores/types/errores.types";

interface Envelope<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

export async function diagnosticarError(id: string): Promise<ErrorDetalle> {
  const { data: envelope } = await apiClient.post<Envelope<ErrorDetalle>>(
    `/errores/${id}/diagnosticar/`,
  );
  return envelope.data;
}
