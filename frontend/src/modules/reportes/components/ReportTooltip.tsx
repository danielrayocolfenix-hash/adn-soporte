interface ReportTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { value: number; name?: string; payload?: { fill?: string } }[];
  valueSuffix?: string;
}

export function ReportTooltip({ active, label, payload, valueSuffix = "" }: ReportTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg px-3 py-2 text-xs">
      {label && <p className="text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>}
      {payload.map((entry, index) => (
        <p key={index} className="font-semibold text-slate-900 dark:text-slate-100">
          {entry.value}
          {valueSuffix}
        </p>
      ))}
    </div>
  );
}
