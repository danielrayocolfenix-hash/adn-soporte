import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  ExternalLink,
  Layout,
  Loader2,
  Plus,
  Save,
  Smartphone,
  Trash2,
  UserCheck,
  CheckSquare,
  ServerCrash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ImageDropField } from "@/modules/qa/components/ImageDropField";
import { useDeleteQa, useProbarEndpoint, useQaDetail, useUpdateQa } from "@/modules/qa/hooks/useQa";
import type { QaFormValues, ReproductionStep } from "@/modules/qa/types/qa.types";
import { ErrorNivelBadge } from "@/modules/errores/components/ErrorNivelBadge";
import { RequestContextPanel } from "@/modules/errores/components/RequestContextPanel";
import { StackFrameList } from "@/modules/errores/components/StackFrameList";
import { formatRelativeTime } from "@/shared/utils/formatRelativeTime";

interface ProbeMessage {
  tone: "ok" | "warn" | "error";
  text: string;
}

function toFormValues(record: NonNullable<ReturnType<typeof useQaDetail>["data"]>): QaFormValues {
  return {
    titulo: record.titulo,
    categoria: record.categoria,
    modulo: record.modulo,
    ambiente: record.ambiente,
    figma_url: record.figma_url ?? "",
    device_or_browser: record.device_or_browser ?? "",
    codigo_error: record.codigo_error ?? "",
    resultado_esperado: record.resultado_esperado,
    resultado_obtenido: record.resultado_obtenido,
    prioridad: record.prioridad === "baja" ? "baja" : record.prioridad,
    imagenAntes: null,
    imagenDespues: null,
  };
}

export function QaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, isError } = useQaDetail(id);
  const updateQa = useUpdateQa(id ?? "");
  const deleteQa = useDeleteQa();
  const probar = useProbarEndpoint();

  const [formData, setFormData] = useState<QaFormValues | null>(null);
  const [steps, setSteps] = useState<ReproductionStep[]>([]);
  const [loadedRecordId, setLoadedRecordId] = useState<string | null>(null);
  const [probeMessage, setProbeMessage] = useState<ProbeMessage | null>(null);

  // Sincronización de estado derivada durante el render
  if (record && record.id !== loadedRecordId) {
    setLoadedRecordId(record.id);
    setFormData(toFormValues(record));
    
    const parsedSteps = record.pasos_reproduccion
      ? record.pasos_reproduccion
          .split("\n")
          .filter(Boolean)
          .map((step) => ({ id: crypto.randomUUID(), step }))
      : [];
      
    setSteps(parsedSteps.length > 0 ? parsedSteps : [{ id: crypto.randomUUID(), step: "" }]);
  }

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { id: crypto.randomUUID(), step: "" }]);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps((prev) => (prev.length === 1 ? prev : prev.filter((s) => s.id !== stepId)));
  };

  const handleStepChange = (stepId: string, value: string) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, step: value } : s)));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    const pasos = steps
      .map((s) => s.step.trim())
      .filter(Boolean)
      .join("\n");

    updateQa.mutate({ values: formData, pasos }, { onSuccess: () => navigate("/qa") });
  };

  const handleProbarEndpoint = () => {
    if (!id || !formData?.codigo_error.trim()) {
      setProbeMessage({
        tone: "error",
        text: "Escribe primero la URL o ruta a probar en \"Código de error / módulo afectado\".",
      });
      return;
    }

    setProbeMessage(null);
    probar.mutate(
      { url: formData.codigo_error.trim(), qaTicketId: id },
      {
        onSuccess: (result) => {
          const found = result.error_group ?? result.browser_error_group;
          if (found) {
            const origen = result.error_group ? "el servidor" : "el navegador (JavaScript)";
            setProbeMessage({
              tone: "error",
              text: `Se detectó y vinculó un error de ${origen}: ${found.exception_type} — ${found.mensaje}`,
            });
            return;
          }
          if (result.network_error) {
            setProbeMessage({
              tone: "error",
              text: `No se pudo contactar el endpoint: ${result.network_error}`,
            });
            return;
          }
          const browserNote = result.browser_probe_error
            ? ` (no se pudo revisar errores de JavaScript: ${result.browser_probe_error})`
            : "";
          setProbeMessage({
            tone: result.ok ? "ok" : "warn",
            text: result.ok
              ? `Respondió ${result.status_code} sin errores internos ni de JavaScript.${browserNote}`
              : `Respondió ${result.status_code}, sin una excepción capturada por el monitor.${browserNote}`,
          });
        },
        onError: (err: unknown) => {
          const message = isAxiosError(err)
            ? (err.response?.data as { error?: { message?: string } } | undefined)?.error
                ?.message
            : undefined;
          setProbeMessage({ tone: "error", text: message ?? "No fue posible probar el endpoint." });
        },
      },
    );
  };

  const handleDelete = () => {
    if (!id || !record) return;
    if (
      window.confirm(`¿Eliminar la prueba "${record.titulo}"? Esta acción no se puede deshacer.`)
    ) {
      deleteQa.mutate(id, { onSuccess: () => navigate("/qa") });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-slate-400 text-sm">
        <Loader2 size={16} className="animate-spin" />
        Cargando prueba QA...
      </div>
    );
  }

  if (isError || !record || !formData) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-rose-500 text-sm">
        <AlertTriangle size={20} />
        No fue posible cargar esta prueba QA.
        <Link to="/qa" className="text-emerald-600 dark:text-emerald-400 hover:underline">
          Volver al listado
        </Link>
      </div>
    );
  }

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
              Editar Reporte de Calidad
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              {record.id} · {record.responsable_nombre}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteQa.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-sm rounded-xl transition-all disabled:opacity-50"
          >
            <Trash2 size={16} />
            Eliminar
          </button>
          <button
            type="submit"
            form="qa-detalle-form"
            disabled={updateQa.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50"
          >
            {updateQa.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {updateQa.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {updateQa.isError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm">
          No fue posible guardar los cambios. Intente nuevamente.
        </div>
      )}

      {record.categoria === "server_error" && record.error_detalle && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-500/30 shadow-xs overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ServerCrash size={18} className="text-rose-500" />
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Diagnóstico automático
                </label>
                <ErrorNivelBadge nivel={record.error_detalle.nivel} />
              </div>
              <p className="text-xs text-slate-400">
                {record.error_detalle.count === 1
                  ? "1 ocurrencia"
                  : `${record.error_detalle.count} ocurrencias`}{" "}
                · última {formatRelativeTime(record.error_detalle.last_seen)}
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Este ticket se generó automáticamente cuando el servidor lanzó esta excepción.
              Usa el detalle de abajo para ubicar la causa y documenta la solución en
              &quot;Comportamiento / Diseño Actual&quot; y el estado del ticket.
            </p>

            <RequestContextPanel error={record.error_detalle} />

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Stack trace
              </label>
              <StackFrameList frames={record.error_detalle.stack_frames} />
            </div>
          </div>
        </div>
      )}

      <form id="qa-detalle-form" onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN 1: Categoría */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Categoría *
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => prev ? { ...prev, categoria: "ui_design" } : null)}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "ui_design"
                  ? "border-purple-500 bg-purple-500/5 dark:bg-purple-500/10 ring-1 ring-purple-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                <Layout size={20} />
              </div>
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Diseño / UI
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => prev ? { ...prev, categoria: "ux_flow" } : null)}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "ux_flow"
                  ? "border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-1 ring-sky-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg shrink-0">
                <UserCheck size={20} />
              </div>
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Comportamiento / UX
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => prev ? { ...prev, categoria: "qa_test" } : null)}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "qa_test"
                  ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                <CheckSquare size={20} />
              </div>
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Prueba Manual QA
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => prev ? { ...prev, categoria: "server_error" } : null)}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                formData.categoria === "server_error"
                  ? "border-rose-500 bg-rose-500/5 dark:bg-rose-500/10 ring-1 ring-rose-500"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
                <ServerCrash size={20} />
              </div>
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Error de Servidor
              </p>
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: Información General */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Detalles de la Incidencia
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
                onChange={(e) => setFormData((prev) => prev ? { ...prev, titulo: e.target.value } : null)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Módulo Afectado
              </label>
              <select
                value={formData.modulo}
                onChange={(e) => setFormData((prev) => prev ? { ...prev, modulo: e.target.value } : null)}
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
                  setFormData((prev) =>
                    prev ? { ...prev, ambiente: e.target.value as QaFormValues["ambiente"] } : null
                  )
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
                  setFormData((prev) =>
                    prev ? { ...prev, prioridad: e.target.value as QaFormValues["prioridad"] } : null
                  )
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Estado actual
              </label>
              <input
                type="text"
                disabled
                value={record.estado}
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

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
                    onChange={(e) =>
                      setFormData((prev) => (prev ? { ...prev, figma_url: e.target.value } : null))
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500 transition-all"
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
                      setFormData((prev) =>
                        prev ? { ...prev, device_or_browser: e.target.value } : null
                      )
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {formData.categoria === "server_error" && (
              <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <ServerCrash size={14} className="text-rose-500" />
                  Código de error / módulo afectado
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formData.codigo_error}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev ? { ...prev, codigo_error: e.target.value } : null,
                      )
                    }
                    placeholder="Ej: /api/v1/qa/ (ruta o URL a probar)"
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleProbarEndpoint}
                    disabled={probar.isPending}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50 shrink-0"
                  >
                    {probar.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Bug size={16} />
                    )}
                    {probar.isPending ? "Probando..." : "Probar endpoint"}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Revisa la respuesta del servidor y abre la URL en un navegador headless para
                  detectar errores de JavaScript. Puede tardar unos segundos.
                </p>
                {probeMessage && (
                  <p
                    className={`mt-2 text-xs ${
                      probeMessage.tone === "ok"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : probeMessage.tone === "warn"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {probeMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 3: Pasos para Reproducir */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pasos para Reproducir
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Comportamiento / Diseño Esperado
              </label>
              <textarea
                rows={3}
                value={formData.resultado_esperado}
                onChange={(e) =>
                  setFormData((prev) => (prev ? { ...prev, resultado_esperado: e.target.value } : null))
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Comportamiento / Diseño Actual
              </label>
              <textarea
                rows={3}
                value={formData.resultado_obtenido}
                onChange={(e) =>
                  setFormData((prev) => (prev ? { ...prev, resultado_obtenido: e.target.value } : null))
                }
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: Evidencia Visual (solo Diseño / UI) */}
        {formData.categoria === "ui_design" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Evidencia Visual: Antes y Después
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageDropField
                label="Cómo estaba (antes)"
                file={formData.imagenAntes}
                existingUrl={record.imagen_antes}
                onChange={(file) =>
                  setFormData((prev) => (prev ? { ...prev, imagenAntes: file } : null))
                }
              />
              <ImageDropField
                label="Cómo quedó (después)"
                file={formData.imagenDespues}
                existingUrl={record.imagen_despues}
                onChange={(file) =>
                  setFormData((prev) => (prev ? { ...prev, imagenDespues: file } : null))
                }
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}