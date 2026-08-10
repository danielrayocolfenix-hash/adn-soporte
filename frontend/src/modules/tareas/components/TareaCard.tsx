import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, ExternalLink, GitBranch, GitPullRequest, SquareCheckBig, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { getInitials } from "@/modules/auth/utils/userDisplay";
import { TareaPriorityBadge } from "@/modules/tareas/components/TareaPriorityBadge";
import type { TareaPrioridad, TareaRecord } from "@/modules/tareas/types/tarea.types";
import { formatRelativeTime } from "@/shared/utils/formatRelativeTime";

const ACCENT_BAR: Record<TareaPrioridad, string> = {
  alta: "bg-rose-500",
  media: "bg-amber-500",
  baja: "bg-slate-400",
};

function formatFecha(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
  });
}

function isOverdue(fechaLimite: string): boolean {
  return new Date(`${fechaLimite}T23:59:59`).getTime() < Date.now();
}

interface TareaCardProps {
  tarea: TareaRecord;
  onDelete: (tarea: TareaRecord) => void;
}

export function TareaCard({ tarea, onDelete }: TareaCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tarea.id,
  });

  const overdue = tarea.fecha_limite ? isOverdue(tarea.fecha_limite) : false;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-3.5 py-3.5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {/* Franja de prioridad */}
      <span className={`absolute left-0 top-0 h-full w-1 ${ACCENT_BAR[tarea.prioridad]}`} />

      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {tarea.titulo}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(tarea);
          }}
          className="opacity-0 group-hover:opacity-100 shrink-0 p-1 -mt-0.5 -mr-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
          title="Eliminar tarea"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {tarea.descripcion && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tarea.descripcion}
        </p>
      )}

      {tarea.qa_origen && (
        <Link
          to={`/qa/detalle/${tarea.qa_origen}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
          title={tarea.qa_origen_titulo ?? undefined}
        >
          <SquareCheckBig size={11} />
          Detección QA
        </Link>
      )}

      {(tarea.rama_github || tarea.pr_url) && (
        <div className="flex items-center gap-3 mt-2.5 text-xs font-mono text-slate-500 dark:text-slate-400">
          {tarea.rama_github && (
            <span className="inline-flex items-center gap-1 truncate">
              <GitBranch size={12} className="shrink-0" />
              <span className="truncate">{tarea.rama_github}</span>
            </span>
          )}
          {tarea.pr_url && (
            <a
              href={tarea.pr_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
            >
              <GitPullRequest size={12} />
              PR
              <ExternalLink size={9} />
            </a>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center gap-2 flex-wrap">
          <TareaPriorityBadge prioridad={tarea.prioridad} />
          {tarea.fecha_limite && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                overdue ? "text-rose-500" : "text-slate-400"
              }`}
              title="Fecha límite"
            >
              <CalendarClock size={12} />
              {formatFecha(tarea.fecha_limite)}
            </span>
          )}
        </div>

        <div
          className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center shrink-0"
          title={tarea.responsable_nombre}
        >
          {getInitials(tarea.responsable_nombre)}
        </div>
      </div>

      <p className="mt-2 text-[10px] text-slate-400" title={new Date(tarea.created_at).toLocaleString("es-CO")}>
        Creada {formatRelativeTime(tarea.created_at)}
      </p>
    </div>
  );
}
