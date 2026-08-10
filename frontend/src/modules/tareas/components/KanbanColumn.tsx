import { useDroppable } from "@dnd-kit/core";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface KanbanColumnProps {
  id: string;
  title: string;
  icon: LucideIcon;
  count: number;
  accentClassName: string;
  children: ReactNode;
}

export function KanbanColumn({ id, title, icon: Icon, count, accentClassName, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0 lg:w-auto lg:min-w-0 bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl p-2.5">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon size={14} className="text-slate-400 shrink-0" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{title}</h3>
        <span
          className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold shrink-0 ${accentClassName}`}
        >
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2.5 p-1 rounded-xl border-2 border-dashed transition-colors min-h-[140px] ${
          isOver ? "border-emerald-400 bg-emerald-500/5" : "border-transparent"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
