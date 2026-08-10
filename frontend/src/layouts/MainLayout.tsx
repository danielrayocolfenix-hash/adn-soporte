import { useState } from "react";
import { Outlet } from "react-router-dom";

import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import { useLogout } from "@/modules/auth/hooks/useLogout";
import { getDisplayName } from "@/modules/auth/utils/userDisplay";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logout = useLogout();
  const { data: currentUser } = useCurrentUser();

  const sidebarUser = currentUser
    ? { name: getDisplayName(currentUser), email: currentUser.email }
    : undefined;

  const topbarUser = currentUser
    ? {
        name: getDisplayName(currentUser),
        role: currentUser.is_staff ? "Administrador" : "Agente de soporte",
      }
    : undefined;

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobile = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 print:h-auto print:overflow-visible print:bg-white">
      {/* Luz Ambiental / Blobs Decorativos */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 dark:bg-sky-500/5 blur-3xl print:hidden" />

      {/* Sidebar Lateral */}
      <div className="contents print:hidden">
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={handleCloseMobile}
          onLogout={logout}
          user={sidebarUser}
        />
      </div>

      {/* Área Contenedora de Topbar y Contenido Principal */}
      <div className="relative z-10 flex flex-1 flex-col h-full min-w-0 overflow-hidden print:h-auto print:overflow-visible">
        {/* Barra Superior con Trigger de Menú Móvil */}
        <div className="contents print:hidden">
          <Topbar onMenuToggle={handleMenuToggle} onLogout={logout} user={topbarUser} />
        </div>

        {/* Área Principal de Contenido (Outlet) */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 print:overflow-visible print:h-auto print:p-0">
          <div className=" max-w-8xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
