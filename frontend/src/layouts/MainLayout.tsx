import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobile = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Luz Ambiental / Blobs Decorativos */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 dark:bg-sky-500/5 blur-3xl" />

      {/* Sidebar Lateral */}
      <Sidebar isOpenMobile={isMobileMenuOpen} onCloseMobile={handleCloseMobile} />

      {/* Área Contenedora de Topbar y Contenido Principal */}
      <div className="relative z-10 flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        {/* Barra Superior con Trigger de Menú Móvil */}
        <Topbar onMenuToggle={handleMenuToggle} />

        {/* Área Principal de Contenido (Outlet) */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          <div className=" max-w-8xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
