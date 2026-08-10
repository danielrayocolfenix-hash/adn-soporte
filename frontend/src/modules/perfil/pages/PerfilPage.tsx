import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Bell,
  Camera,
  Save,
  CheckCircle2,
  Smartphone,
  Globe,
  Briefcase,
} from "lucide-react";

import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import { getDisplayName, getInitials } from "@/modules/auth/utils/userDisplay";
import {
  DEFAULT_PREFERENCES_DATA,
  DEFAULT_PROFILE_DATA,
  DEFAULT_SECURITY_DATA,
} from "@/modules/perfil/services/perfilMockData";
import type { ActiveTab } from "@/modules/perfil/types/perfil.types";

export function PerfilPage() {
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados del Formulario de Perfil
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE_DATA);

  // Precarga el nombre/correo/rol reales en cuanto llega el usuario autenticado,
  // ajustando durante el render (no en un efecto) para evitar un render extra.
  const [loadedUserId, setLoadedUserId] = useState<number | null>(null);
  if (currentUser && currentUser.id !== loadedUserId) {
    setLoadedUserId(currentUser.id);
    setProfileData((prev) => ({
      ...prev,
      name: getDisplayName(currentUser),
      email: currentUser.email,
      role: currentUser.is_staff ? "Administrador" : "Agente de soporte",
    }));
  }

  // Estados de Seguridad
  const [securityData, setSecurityData] = useState(DEFAULT_SECURITY_DATA);

  // Estados de Preferencias
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES_DATA);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header del Perfil / Banner */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Banner de Fondo */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />

        <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          {/* Avatar y Datos de Cabecera */}
          <div className="flex items-end gap-4">
            <div className="relative group">
              <div className="size-24 rounded-2xl bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                <span>{getInitials(profileData.name)}</span>
              </div>
              <button
                type="button"
                className="absolute bottom-1 right-1 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-90 transition-opacity backdrop-blur-xs"
                title="Cambiar foto de perfil"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {profileData.name}
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Activo
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{profileData.role}</p>
            </div>
          </div>

          {/* Botón de Guardar Cambios */}
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-indigo-600/20 self-end"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={16} />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-t border-slate-200 dark:border-slate-800 px-6 gap-2 sm:gap-6 bg-slate-50/50 dark:bg-slate-800/20 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "personal"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <User size={16} />
            Información Personal
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "security"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <Shield size={16} />
            Seguridad y Acceso
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "preferences"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            <Bell size={16} />
            Preferencias
          </button>
        </div>
      </div>

      {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
      {activeTab === "personal" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Datos Personales y Profesionales
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actualiza tus datos de contacto y la información visible dentro del equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cargo / Rol
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Módulo / Área
              </label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Biografía / Notas
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Cambio de Contraseña */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Key size={18} className="text-indigo-500" />
                Cambiar Contraseña
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Asegúrate de utilizar una contraseña segura con al menos 8 caracteres.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Autenticación de Dos Factores */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                <Smartphone size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Autenticación de Dos Factores (2FA)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Añade una capa adicional de seguridad solicitando un código en cada inicio de
                  sesión.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={securityData.twoFactorEnabled}
                onChange={(e) =>
                  setSecurityData({ ...securityData, twoFactorEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Notificaciones y Sistema
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configura cómo y cuándo deseas recibir alertas del sistema.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Notificaciones por Correo
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recibe resúmenes diarios de los reportes y asignaciones de QA.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, emailNotifications: e.target.checked })
                }
                className="size-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Alertas Críticas de UI / Fallos
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notificar inmediatamente cuando un error de prioridad 'Alta' sea registrado.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.qaAlerts}
                onChange={(e) => setPreferences({ ...preferences, qaAlerts: e.target.checked })}
                className="size-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe size={14} className="text-slate-400" />
                Idioma de la Interfaz
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full md:w-64 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
