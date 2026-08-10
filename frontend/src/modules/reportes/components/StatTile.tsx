import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  delta?: { value: string; isGood: boolean };
  note?: string;
}

export function StatTile({ label, value, icon: Icon, iconClassName, delta, note }: StatTileProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs print:border-slate-300 print:shadow-none break-inside-avoid">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 print:text-slate-600">
          {label}
        </span>
        <div className={`p-2 rounded-xl print:hidden ${iconClassName ?? "bg-emerald-500/10 text-emerald-500"}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 print:text-black">{value}</h3>
        {delta && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              delta.isGood ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
            }`}
          >
            {delta.isGood ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {delta.value}
          </span>
        )}
      </div>
      {note && <p className="text-[11px] text-slate-400 mt-1 print:text-slate-600">{note}</p>}
    </div>
  );
}
