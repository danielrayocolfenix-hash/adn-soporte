import { useState, useEffect } from "react";
import {
  BarChart2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  LogOut,
  Settings,
  SquareTerminal,
  User,
  X,
  Ticket,
  CircleAlert,
  SquareCheckBig,
  type LucideIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface MenuGroup {
  key: string;
  label: string;
  icon: LucideIcon;
  items: { to: string; label: string }[];
}

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

const MENU_GROUPS: MenuGroup[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: BarChart2,
    items: [{ to: "/dashboard", label: "Resumen" }],
  },
  {
    key: "ticket",
    label: "Tickets",
    icon: Ticket,
    items: [
      { to: "/tickets", label: "Listado" },
      { to: "/tickets/nuevo", label: "Nuevo ticket" },
    ],
  },
  {
    key: "qa",
    label: "QA",
    icon: SquareCheckBig,
    items: [
      { to: "/qa", label: "Listado" },
      { to: "/qa/nueva", label: "Nueva prueba" },
      { to: "/qa/historial", label: "Historial" },
    ],
  },
  {
    key: "tareas",
    label: "Tareas",
    icon: ClipboardCheck,
    items: [
      { to: "/tareas", label: "Listado" },
      { to: "/tareas/nueva", label: "Nueva tarea" },
      { to: "/tareas/historial", label: "Historial" },
    ],
  },
  {
    key: "configuracion",
    label: "Configuración",
    icon: Settings,
    items: [{ to: "/configuracion", label: "General" }],
  },
  {
    key: "centro-ayuda",
    label: "Centro de ayuda",
    icon: CircleAlert,
    items: [{ to: "/cent-ayuda", label: "Manual de usuario" }],
  },
];

function isRouteActive(currentPath: string, itemPath: string): boolean {
  if (currentPath === itemPath) return true;
  return currentPath.startsWith(`${itemPath}/`);
}

function findActiveGroup(pathname: string): string | null {
  return (
    MENU_GROUPS.find((group) => group.items.some((item) => isRouteActive(pathname, item.to)))
      ?.key ?? null
  );
}

export default function Sidebar({
  isOpenMobile = false,
  onCloseMobile,
  user = { name: "Usuario ADN", email: "soporte@adn.com" },
  onLogout,
}: SidebarProps) {
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar_expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [openGroup, setOpenGroup] = useState<string | null>(() =>
    findActiveGroup(location.pathname),
  );

  useEffect(() => {
    localStorage.setItem("sidebar_expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  // Mantiene abierto el grupo activo al navegar, sin pasar por un efecto:
  // se ajusta durante el render comparando con la ruta anterior.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    const activeGroup = findActiveGroup(location.pathname);
    if (activeGroup && isExpanded) {
      setOpenGroup(activeGroup);
    }
  }

  const toggleGroup = (key: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      setOpenGroup(key);
      return;
    }
    setOpenGroup((current) => (current === key ? null : key));
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`relative fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-slate-800/60 bg-slate-950 text-slate-400 shadow-2xl transition-all duration-300 ease-in-out md:static md:z-20 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isExpanded ? "w-64" : "w-16"}`}
      >
        {/* BOTÓN FLOTANTE PARA EXPANDIR / CONTRAER (Desktop) */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? "Contraer menú" : "Expandir menú"}
          className="hidden md:flex absolute -right-3.5 top-5 z-30 size-7 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-400 shadow-lg hover:bg-slate-900 hover:text-emerald-400 hover:border-emerald-500/30 transition-all hover:scale-110"
        >
          {isExpanded ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </button>

        {/* HEADER CON LOGO VISIBLE */}
        <div
          className={`flex h-16 items-center border-b border-slate-900 transition-all duration-300 ${
            isExpanded ? "justify-between px-4" : "justify-center px-0"
          }`}
        >
          <div
            className={`flex items-center gap-3 overflow-hidden ${
              !isExpanded && "justify-center w-full"
            }`}
          >
            {/* Contenedor del Logo con Efecto Glow */}
            <div
              onClick={() => !isExpanded && setIsExpanded(true)}
              title={!isExpanded ? "ADN-Soporte (Clic para expandir)" : undefined}
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-transform duration-200 ${
                !isExpanded ? "cursor-pointer hover:scale-105" : ""
              }`}
            >
              <SquareTerminal className="size-5 text-emerald-400" />
            </div>

            {/* Texto de Marca (Solo en modo expandido) */}
            {isExpanded && (
              <span className="truncate text-sm font-semibold tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ADN-Soporte
              </span>
            )}
          </div>

          {/* Botón de cierre exclusivo para móviles */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-900 hover:text-slate-200 md:hidden"
            aria-label="Cerrar menú móvil"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-slate-800">
          {MENU_GROUPS.map((group) => {
            const Icon = group.icon;
            const isOpen = isExpanded && openGroup === group.key;
            const isGroupActive = group.items.some((item) =>
              isRouteActive(location.pathname, item.to),
            );

            return (
              <div key={group.key} className="group relative">
                {/* Botón Principal de Grupo */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`submenu-${group.key}`}
                  onClick={() => toggleGroup(group.key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative ${
                    isGroupActive
                      ? "bg-slate-900/90 text-emerald-400 border border-slate-800/80 shadow-xs"
                      : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
                >
                  {isGroupActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  )}

                  <Icon
                    className={`size-4 shrink-0 transition-colors ${
                      isGroupActive
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />

                  {isExpanded && (
                    <>
                      <span className="flex-1 truncate text-left tracking-wide">{group.label}</span>
                      <ChevronDown
                        className={`size-3.5 shrink-0 text-slate-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-400" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                {/* Submenú Desplegable (Modo Expandido) */}
                <div
                  id={`submenu-${group.key}`}
                  className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <ul className="ml-5 min-h-0 space-y-1 border-l border-slate-800/80 pl-3">
                    {group.items.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={() => onCloseMobile?.()}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                                : "text-slate-500 hover:text-slate-300 hover:translate-x-0.5"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tooltip / Submenú Flotante (Modo Colapsado) */}
                {!isExpanded && (
                  <div className="absolute left-full top-0 ml-3 w-48 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl opacity-0 invisible translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 z-30">
                    <p className="px-2.5 py-1.5 text-xs font-semibold text-slate-200 border-b border-slate-900 mb-1">
                      {group.label}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const isSubActive = isRouteActive(location.pathname, item.to);
                        return (
                          <li key={item.to}>
                            <NavLink
                              to={item.to}
                              className={`block rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                isSubActive
                                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                              }`}
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-slate-900 p-3">
          {isExpanded ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-900 bg-slate-900/30 p-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-xs font-medium text-slate-200">{user.name}</span>
                  <span className="truncate text-[10px] text-slate-500">{user.email}</span>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="size-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center py-1 font-mono text-[10px] font-bold text-emerald-500/40">
              v0.1
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
