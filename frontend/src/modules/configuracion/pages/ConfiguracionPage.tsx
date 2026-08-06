import { useState } from "react";
import { Check, Save, Sliders } from "lucide-react";

import {
  CONFIG_TABS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  INTEGRATIONS_MOCK_DATA,
  NOTIFICATION_ITEMS_CONFIG,
} from "@/modules/configuracion/services/configuracionMockData";
import type { ConfiguracionTab } from "@/modules/configuracion/types/configuracion.types";

export function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<ConfiguracionTab>("general");
  const [isSaved, setIsSaved] = useState(false);

  const [generalSettings, setGeneralSettings] = useState(DEFAULT_GENERAL_SETTINGS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [security, setSecurity] = useState(DEFAULT_SECURITY_SETTINGS);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-8xl pb-10">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Sliders className="size-6 text-emerald-500" />
            Configuración General
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra las preferencias del proyecto, seguridad, integraciones y notificaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-emerald-600/20"
        >
          {isSaved ? (
            <>
              <Check size={16} /> ¡Guardado!
            </>
          ) : (
            <>
              <Save size={16} /> Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* Estructura Principal: Navegación + Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menú de Pestañas Lateral */}
        <nav className="space-y-1 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
          {CONFIG_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Panel de Contenido */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Preferencias del Proyecto
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ajusta los parámetros principales de la interfaz y comportamiento.
                </p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Proyecto
                  </label>
                  <input
                    type="text"
                    value={generalSettings.projectName}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, projectName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Entorno por Defecto
                  </label>
                  <select
                    value={generalSettings.defaultEnv}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, defaultEnv: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Development">Development (DEV)</option>
                    <option value="Staging">Staging (STG)</option>
                    <option value="Production">Production (PROD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Idioma de la Interfaz
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, language: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="es">Español (ES)</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICACIONES */}
          {activeTab === "notificaciones" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Alertas y Notificaciones
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Elige cuándo y dónde recibir avisos sobre las pruebas QA.
                </p>
              </div>

              <div className="space-y-4">
                {NOTIFICATION_ITEMS_CONFIG.map((item) => {
                  const ItemIcon = item.icon;
                  const isChecked = notifications[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded-lg">
                          <ItemIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]: !isChecked,
                          })
                        }
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          isChecked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            isChecked ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SEGURIDAD */}
          {activeTab === "seguridad" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Seguridad y Tokens
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Gestiona credenciales de API y políticas de autenticación.
                </p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    API Key del Proyecto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      readOnly
                      value={security.apiKey}
                      className="flex-1 px-3.5 py-2 font-mono text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Expiración de Sesión (Minutos)
                  </label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="15">15 Minutos</option>
                    <option value="30">30 Minutos</option>
                    <option value="60">1 Hora</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTEGRACIONES */}
          {activeTab === "integraciones" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Integraciones de CI/CD
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Conecta el sistema de QA con tu pipeline de despliegue continuo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INTEGRATIONS_MOCK_DATA.map((integ) => (
                  <div
                    key={integ.name}
                    className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {integ.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {integ.desc}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        integ.status === "Conectado"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {integ.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
