import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/modules/auth/services/authApi";
import { isAuthenticated } from "@/modules/auth/hooks/useAuth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}
