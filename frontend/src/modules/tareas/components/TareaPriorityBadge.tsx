import type { TareaPrioridad } from "@/modules/tareas/types/tarea.types";

const STYLES: Record<TareaPrioridad, string> = {
  alta: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  media: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  baja: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

const LABELS: Record<TareaPrioridad, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export function TareaPriorityBadge({ prioridad }: { prioridad: TareaPrioridad }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${STYLES[prioridad]}`}
    >
      {LABELS[prioridad]}
    </span>
  );
}
