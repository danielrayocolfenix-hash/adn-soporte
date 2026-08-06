import type { ClientTicket } from "@/modules/dashboard/types/dashboard.types";

export function PriorityBadge({ priority }: { priority: ClientTicket["priority"] }) {
  switch (priority) {
    case "critica":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          CRÍTICA
        </span>
      );
    case "alta":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          ALTA
        </span>
      );
    case "media":
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          MEDIA
        </span>
      );
  }
}
