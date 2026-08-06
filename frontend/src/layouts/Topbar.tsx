import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Moon,
  Sun,
  Check,
  X,
} from "lucide-react";

interface TopbarProps {
  onMenuToggle?: () => void;
  user?: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}

export default function Topbar({
  onMenuToggle,
  user = {
    name: "Ana Martínez",
    role: "Administradora",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState("ES");
  const [searchQuery, setSearchQuery] = useState("");

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowProfileMenu(false);
        setShowLangMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Alternar modo oscuro (añade/quita la clase 'dark' en <html>)
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return nextMode;
    });
  };

  return (
    <header className="h-16 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      {/* SECCIÓN IZQUIERDA: Menú móvil y Buscador */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            aria-label="Abrir menú"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Input de Búsqueda con botón de limpiar */}
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en la plataforma..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: Acciones rápidas y Perfil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Selector de Idioma (Dropdown funcional) */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            aria-label="Cambiar idioma"
            className="p-2 sm:px-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <Globe size={18} />
            <span className="text-xs font-semibold uppercase">{currentLang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              {[
                { code: "ES", label: "Español" },
                { code: "EN", label: "English" },
                { code: "PT", label: "Português" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setShowLangMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span>{lang.label}</span>
                  {currentLang === lang.code && (
                    <Check size={14} className="text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Modo Oscuro / Claro */}
        <button
          onClick={toggleDarkMode}
          aria-label="Alternar tema"
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notificaciones */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowLangMenu(false);
            }}
            aria-label="Ver notificaciones"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                  Notificaciones
                </span>
                <span className="text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  2 Nuevas
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
                <a
                  href="#notif-1"
                  className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Nuevo usuario registrado
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Hace 5 minutos
                  </p>
                </a>
                <a
                  href="#notif-2"
                  className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Reporte mensual generado con éxito
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Hace 1 hora
                  </p>
                </a>
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-center">
                <a
                  href="#todas"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Ver todas las notificaciones
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Separador Visual */}
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

        {/* Perfil de Usuario */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowLangMenu(false);
            }}
            aria-label="Menú de usuario"
            className="flex items-center gap-2.5 p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">{user.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Info de usuario para móvil */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60 md:hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>

              <a
                href="#perfil"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <User size={16} className="text-slate-400" />
                Mi Perfil
              </a>
              <a
                href="#ajustes"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Settings size={16} className="text-slate-400" />
                Ajustes
              </a>

              <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1"></div>

              <button
                onClick={() => console.log("Cerrar sesión")}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-medium"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
