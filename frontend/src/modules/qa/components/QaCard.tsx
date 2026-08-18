import { useState } from "react";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  CheckSquare,
  ExternalLink,
  Layout,
  ListChecks,
  Loader2,
  Pencil,
  RotateCcw,
  Save,
  ServerCrash,
  Sparkles,
  Trash2,
  UserCheck,
  Wand2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { CategoryBadge } from "@/modules/qa/components/CategoryBadge";
import { ESTADO_LABELS, ESTADO_ORDER, ESTADO_STYLES, ESTADOS_RESUELTOS } from "@/modules/qa/constants/estado";
import { useUpdateQaEstado, useUpdateQaSolucion } from "@/modules/qa/hooks/useQa";
import type { NewReportCategory, QaEstado, QaRecord } from "@/modules/qa/types/qa.types";
import { getInitials } from "@/modules/auth/utils/userDisplay";
import { formatRelativeTime } from "@/shared/utils/formatRelativeTime";

const PRIORIDAD_STYLES: Record<string, string> = {
  alta: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  media: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  baja: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const ACCENT_BAR: Record<string, string> = {
  alta: "bg-rose-500",
  media: "bg-amber-500",
  baja: "bg-slate-400",
};

const CATEGORIA_VISUAL: Record<NewReportCategory, { icon: typeof Layout; bg: string; text: string }> = {
  ui_design: { icon: Layout, bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  ux_flow: { icon: UserCheck, bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
  qa_test: { icon: CheckSquare, bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  server_error: { icon: ServerCrash, bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
};

const CATEGORIAS_DISENO = ["ui_design", "ux_flow"];

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

interface QaCardProps {
  qa: QaRecord;
  onDelete: (id: string, titulo: string) => void;
}

export function QaCard({ qa, onDelete }: QaCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [solucion, setSolucion] = useState(qa.resultado_obtenido);
  const [justSaved, setJustSaved] = useState(false);
  const [estadoError, setEstadoError] = useState<string | null>(null);
  const updateSolucion = useUpdateQaSolucion();
  const updateEstado = useUpdateQaEstado();

  const esDiseno = CATEGORIAS_DISENO.includes(qa.categoria);
  const estaResuelto = ESTADOS_RESUELTOS.includes(qa.estado);
  const tieneEvidencia = Boolean(qa.imagen_antes && qa.imagen_despues);
  const visual = CATEGORIA_VISUAL[qa.categoria];
  const CategoriaIcon = visual.icon;

  const handleGuardarSolucion = () => {
    updateSolucion.mutate(
      { id: qa.id, resultadoObtenido: solucion },
      {
        onSuccess: () => {
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 2000);
        },
      },
    );
  };

  const handleEstadoChange = (estado: QaEstado) => {
    setEstadoError(null);
    updateEstado.mutate(
      { id: qa.id, estado },
      {
        onError: (err: unknown) => {
          const message = isAxiosError(err)
            ? (err.response?.data as { error?: { message?: string } } | undefined)?.error
                ?.message
            : undefined;
          setEstadoError(message ?? "No fue posible cambiar el estado.");
          setTimeout(() => setEstadoError(null), 4000);
        },
      },
    );
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden transition-all ${
        isExpanded ? "ring-1 ring-slate-200 dark:ring-slate-800" : ""
      }`}
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${ACCENT_BAR[qa.prioridad]}`} />

      {/* Encabezado (siempre visible, clic para expandir) */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3.5 pl-5 pr-4 py-4 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div
          className={`flex items-center justify-center size-9 rounded-xl shrink-0 ${visual.bg} ${visual.text}`}
        >
          <CategoriaIcon size={17} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
              {qa.titulo}
            </span>
            {estaResuelto && <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />}
            {qa.veces_reabierto > 0 && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0"
                title="El monitor detectó que este problema volvió a ocurrir después de darse por resuelto"
              >
                <RotateCcw size={10} />
                Regresión ×{qa.veces_reabierto}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <CategoryBadge category={qa.categoria} />
            <span
              className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold border uppercase ${PRIORIDAD_STYLES[qa.prioridad]}`}
            >
              {t(`common.priority.${qa.prioridad}`)}
            </span>
            <select
              value={qa.estado}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                handleEstadoChange(e.target.value as QaEstado);
              }}
              disabled={updateEstado.isPending}
              title="Cambiar estado"
              className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase cursor-pointer focus:outline-none disabled:opacity-50 ${ESTADO_STYLES[qa.estado]}`}
            >
              {ESTADO_ORDER.map((estado) => (
                <option key={estado} value={estado}>
                  {ESTADO_LABELS[estado]}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400">
              {qa.modulo} · {qa.ambiente}
            </span>
            {estadoError && (
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                <AlertTriangle size={11} />
                {estadoError}
              </span>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0 pl-2">
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <CalendarDays size={12} />
            {formatFecha(qa.created_at)}
          </span>
          <div
            className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-slate-900"
            title={qa.responsable_nombre}
          >
            {getInitials(qa.responsable_nombre)}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0 border-l border-slate-100 dark:border-slate-800 pl-2 ml-1">
          <Link
            to={`/qa/detalle/${qa.id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(qa.id, qa.titulo);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
          <ChevronDown
            size={16}
            className={`ml-1 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Cuerpo expandible */}
      {isExpanded && (
        <div className="pl-5 pr-5 pb-5 pt-4 border-t border-slate-100 dark:border-slate-800/70 bg-slate-50/40 dark:bg-slate-950/20 space-y-4">
          {qa.categoria === "server_error" && qa.error_detalle ? (
            <Link
              to={`/qa/detalle/${qa.id}`}
              onClick={(e) => e.stopPropagation()}
              className="block rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 px-3.5 py-2.5 hover:border-rose-500/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 truncate">
                  <ServerCrash size={12} className="shrink-0" />
                  {qa.error_detalle.exception_type}
                </p>
                <span className="shrink-0 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {qa.error_detalle.count}x · {formatRelativeTime(qa.error_detalle.last_seen)}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-1">
                {qa.error_detalle.mensaje}
              </p>
              {(() => {
                const frame =
                  qa.error_detalle.stack_frames.find((f) => f.in_app) ??
                  qa.error_detalle.stack_frames[0];
                return frame ? (
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                    {frame.file}:{frame.line}
                  </p>
                ) : null;
              })()}
            </Link>
          ) : (
            qa.categoria === "server_error" &&
            qa.codigo_error && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <ServerCrash size={12} />
                {qa.codigo_error}
              </div>
            )
          )}

          {qa.pasos_reproduccion && (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                <ListChecks size={12} /> Pasos para reproducir
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                {qa.pasos_reproduccion}
              </p>
            </div>
          )}

          {qa.resultado_esperado && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Comportamiento esperado
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                {qa.resultado_esperado}
              </p>
            </div>
          )}

          {esDiseno ? (
            <>
              {estaResuelto && tieneEvidencia ? (
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                    <Sparkles size={12} /> Evidencia: antes y después
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={qa.imagen_antes ?? undefined} target="_blank" rel="noreferrer" className="group block">
                      <p className="text-[10px] font-medium text-slate-400 mb-1">Antes</p>
                      <img
                        src={qa.imagen_antes ?? undefined}
                        alt="Antes"
                        className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-800 group-hover:opacity-90 transition-opacity"
                      />
                    </a>
                    <a href={qa.imagen_despues ?? undefined} target="_blank" rel="noreferrer" className="group block">
                      <p className="text-[10px] font-medium text-emerald-500 mb-1">Después</p>
                      <img
                        src={qa.imagen_despues ?? undefined}
                        alt="Después"
                        className="w-full h-36 object-cover rounded-xl border border-emerald-200 dark:border-emerald-900/60 group-hover:opacity-90 transition-opacity"
                      />
                    </a>
                  </div>
                </div>
              ) : (
                <Link
                  to={`/qa/detalle/${qa.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl transition-all shadow-sm shadow-indigo-600/20"
                >
                  Ver detalle completo
                  <ExternalLink size={14} />
                </Link>
              )}
            </>
          ) : (
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                <Wand2 size={12} /> Solución
              </label>
              <textarea
                rows={3}
                value={solucion}
                onChange={(e) => setSolucion(e.target.value)}
                placeholder="Describe la causa raíz y la solución aplicada..."
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none transition-all"
              />
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleGuardarSolucion}
                  disabled={updateSolucion.isPending || solucion === qa.resultado_obtenido}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-all disabled:opacity-40"
                >
                  {updateSolucion.isPending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Save size={13} />
                  )}
                  Guardar solución
                </button>
                {justSaved && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Guardado
                  </span>
                )}
                <Link
                  to={`/qa/detalle/${qa.id}`}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline ml-auto"
                >
                  Ver detalle completo
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
