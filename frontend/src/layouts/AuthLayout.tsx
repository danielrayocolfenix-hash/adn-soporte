import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center dark:bg-slate-900/60 justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-lg border dark:border-slate-500/50 dark:backdrop-blur-sm p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
