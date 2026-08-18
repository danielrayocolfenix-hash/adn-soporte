import { History } from "lucide-react";

import { formatRelativeTime } from "@/shared/utils/formatRelativeTime";

const MAX_VISIBLE = 20;

export function OccurrenceHistory({ timestamps }: { timestamps: string[] }) {
  if (timestamps.length === 0) return null;

  const mostRecentFirst = [...timestamps].reverse();
  const visible = mostRecentFirst.slice(0, MAX_VISIBLE);
  const hiddenCount = mostRecentFirst.length - visible.length;

  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        <History size={12} /> Historial de ocurrencias ({timestamps.length})
      </p>
      <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80">
        {visible.map((iso, index) => (
          <div
            key={`${iso}-${index}`}
            className="flex items-center justify-between px-3.5 py-1.5 text-xs"
          >
            <span className="text-slate-600 dark:text-slate-300">{formatRelativeTime(iso)}</span>
            <span className="font-mono text-[11px] text-slate-400">
              {new Date(iso).toLocaleString("es-CO", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <p className="mt-1 text-[11px] text-slate-400">
          + {hiddenCount} ocurrencias más antiguas no mostradas.
        </p>
      )}
    </div>
  );
}
