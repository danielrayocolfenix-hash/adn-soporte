import { apiClient } from "@/shared/services/apiClient";
import type { CurrentUser, LoginPayload, TokenPair } from "@/modules/auth/types/auth.types";

export async function login(payload: LoginPayload): Promise<TokenPair> {
  const { data } = await apiClient.post<TokenPair>("/auth/login/", payload);
  return data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>("/usuarios/me/");
  return data;
}
