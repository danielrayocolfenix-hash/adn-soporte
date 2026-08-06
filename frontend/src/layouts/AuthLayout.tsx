import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-lg border border-border bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
