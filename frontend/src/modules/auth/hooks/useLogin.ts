import { useMutation } from "@tanstack/react-query";

import { login } from "@/modules/auth/services/authApi";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (tokens) => {
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
    },
  });
}
