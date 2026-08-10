import { Navigate, Outlet } from "react-router-dom";

import { isAuthenticated } from "@/modules/auth/hooks/useAuth";

export function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
