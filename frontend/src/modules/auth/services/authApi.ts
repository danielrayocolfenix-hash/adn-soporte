import { apiClient } from "@/shared/services/apiClient";
import type { LoginPayload, TokenPair } from "@/modules/auth/types/auth.types";

export async function login(payload: LoginPayload): Promise<TokenPair> {
  const { data } = await apiClient.post<TokenPair>("/auth/login/", payload);
  return data;
}
