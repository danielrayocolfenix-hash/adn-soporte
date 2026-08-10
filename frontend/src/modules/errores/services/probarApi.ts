import { apiClient } from "@/shared/services/apiClient";
import type { ProbeResult } from "@/modules/errores/types/errores.types";

interface Envelope<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

export async function probarEndpoint(url: string, qaTicketId?: string): Promise<ProbeResult> {
  const { data: envelope } = await apiClient.post<Envelope<ProbeResult>>("/errores/probar/", {
    url,
    qa_ticket: qaTicketId,
  });
  return envelope.data;
}
