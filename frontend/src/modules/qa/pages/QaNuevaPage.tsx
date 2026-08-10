import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Layout,
  UserCheck,
  CheckSquare,
  ExternalLink,
  Smartphone,
  ServerCrash,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ImageDropField } from "@/modules/qa/components/ImageDropField";
import { useCreateQa } from "@/modules/qa/hooks/useQa";
import type { QaFormValues, ReproductionStep } from "@/modules/qa/types/qa.types";

const INITIAL_FORM: QaFormValues = {
  titulo: "",
  categoria: "ui_design",
  modulo: "Autenticación",
  ambiente: "Staging",
  figma_url: "",
  device_or_browser: "iPhone 13 / Safari Mobile",
  codigo_error: "",
  resultado_esperado: "",
  resultado_obtenido: "",
  prioridad: "media",
  imagenAntes: null,
  imagenDespues: null,
};

export function QaNuevaPage() {
  const navigate = useNavigate();
  const createQa = useCreateQa();

  const [formData, setFormData] = useState<QaFormValues>(INITIAL_FORM);
  const [steps, setSteps] = useState<ReproductionStep[]>([
    { id: "1", step: "Ingresar a la pantalla de Checkout en pantalla responsive (375px)" },
  ]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { id: Date.now().toString(), step: "" }]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length === 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStepChange = (id: string, value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, step: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pasos = steps
      .map((s) => s.step.trim())
      .filter(Boolean)
      .join("\n");
    createQa.mutate({ values: formData, pasos }, { onSuccess: () => navigate("/qa") });
  };

  return (
    <div className="space-y-6 max-w-8xl pb-10">
      {/* Header con navegación y acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/qa"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver a la lista"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Nuevo Reporte de Calidad
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Registra discrepancias visuales de diseño, inconsistencias de UX o casos de prueba
              manuales.
            </p>
          </div>
        </div>

        <button
          type="submit"
          form="qa-nueva-form"
          disabled={createQa.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50"
        >
          <Send size={16} />
          {createQa.isPending ? "Publicando..." : "Publicar Incidencia"}
        </button>
      </div>

      {createQa.isError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          No fue posible guardar el reporte. Verifique los datos e intente nuevamente.
        </div>
      )}

      <form id="qa-nueva-form" onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN 1: Selección de Categoría */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            1. Selecciona la Categoría *
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, categoria: "ui_design" })}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "ui_design"
                  ? "border-purple-500 bg-purple-500/5 dark:bg-purple-500/10 ring-1 ring-purple-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                <Layout size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Diseño / UI
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Desalineaciones, colores incorrectos, padding o tipografía fuera de spec.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, categoria: "ux_flow" })}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "ux_flow"
                  ? "border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-1 ring-sky-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Comportamiento / UX
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Flujos confusos, modales congelados o feedback visual ausente.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, categoria: "qa_test" })}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "qa_test"
                  ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <CheckSquare size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Prueba Manual QA
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Escenario de validación funcional rutinario para la suite de regresión.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, categoria: "server_error" })}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "server_error"
                  ? "border-rose-500 bg-rose-500/5 dark:bg-rose-500/10 ring-1 ring-rose-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
                <ServerCrash size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Error de Servidor
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Errores 500, timeouts, excepciones no controladas u otras fallas del backend.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: Información General */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            2. Detalles de la Incidencia
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Título del Reporte *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder={
                  formData.categoria === "ui_design"
                    ? "Ej: El botón 'Pagar' sobrepasa la barra de navegación en vista móvil"
                    : "Ej: Modal de confirmación no se cierra tras completar la acción"
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Módulo Afectado
              </label>
              <select
                value={formData.modulo}
                onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Autenticación">Autenticación</option>
                <option value="Facturación">Facturación / Checkout</option>
                <option value="Perfil de Usuario">Perfil de Usuario</option>
                <option value="Notificaciones">Notificaciones</option>
                <option value="Dashboard">Dashboard Principal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Entorno
              </label>
              <select
                value={formData.ambiente}
                onChange={(e) =>
                  setFormData({ ...formData, ambiente: e.target.value as QaFormValues["ambiente"] })
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Staging">Staging (STG)</option>
                <option value="Development">Development (DEV)</option>
                <option value="Production">Production (PROD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prioridad
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prioridad: e.target.value as QaFormValues["prioridad"],
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            {/* Campos Condicionales de Diseño / UX */}
            {formData.categoria === "ui_design" && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <ExternalLink size={14} className="text-purple-500" />
                    Enlace de Figma / Especificación Visual
                  </label>
                  <input
                    type="url"
                    value={formData.figma_url}
                    onChange={(e) => setFormData({ ...formData, figma_url: e.target.value })}
                    placeholder="https://figma.com/file/..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Smartphone size={14} className="text-purple-500" />
                    Dispositivo / Navegador Probado
                  </label>
                  <input
                    type="text"
                    value={formData.device_or_browser}
                    onChange={(e) =>
                      setFormData({ ...formData, device_or_browser: e.target.value })
                    }
                    placeholder="Ej: Safari iOS 17 / iPhone 13 Pro"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo Condicional de Error de Servidor */}
            {formData.categoria === "server_error" && (
              <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <ServerCrash size={14} className="text-rose-500" />
                  Código de error / módulo afectado
                </label>
                <input
                  type="text"
                  value={formData.codigo_error}
                  onChange={(e) => setFormData({ ...formData, codigo_error: e.target.value })}
                  placeholder="Ej: 500, TimeoutError, /api/v1/qa/"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 3: Pasos para Reproducir */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              3. Pasos para Reproducir la Discrepancia
            </label>
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors"
            >
              <Plus size={14} /> Añadir Paso
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <span className="size-6 shrink-0 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={step.step}
                  onChange={(e) => handleStepChange(step.id, e.target.value)}
                  placeholder="Escribe la acción ejecutada..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStep(step.id)}
                  disabled={steps.length === 1}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Comparativa: Esperado vs Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Comportamiento / Diseño Esperado
              </label>
              <textarea
                rows={3}
                value={formData.resultado_esperado}
                onChange={(e) => setFormData({ ...formData, resultado_esperado: e.target.value })}
                placeholder="Según Figma, el botón debe tener un padding de 16px y alineación centrada..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Comportamiento / Diseño Actual
              </label>
              <textarea
                rows={3}
                value={formData.resultado_obtenido}
                onChange={(e) => setFormData({ ...formData, resultado_obtenido: e.target.value })}
                placeholder="El botón se desborda hacia la derecha ocupando el 100% del ancho disponible..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: Evidencia Visual (solo Diseño / UI) */}
        {formData.categoria === "ui_design" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              4. Evidencia Visual: Antes y Después
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageDropField
                label="Cómo estaba (antes)"
                file={formData.imagenAntes}
                onChange={(file) => setFormData({ ...formData, imagenAntes: file })}
              />
              <ImageDropField
                label="Cómo quedó (después)"
                file={formData.imagenDespues}
                onChange={(file) => setFormData({ ...formData, imagenDespues: file })}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
