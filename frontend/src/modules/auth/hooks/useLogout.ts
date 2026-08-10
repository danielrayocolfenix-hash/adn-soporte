import { useNavigate } from "react-router-dom";

import { clearSession } from "@/modules/auth/hooks/useAuth";

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    clearSession();
    navigate("/login", { replace: true });
  };
}
