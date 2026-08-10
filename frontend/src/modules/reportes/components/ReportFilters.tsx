interface ReportFiltersProps {
  dateFrom: string;
  dateTo: string;
  prioridad: string;
  categoria: string;
  responsable: string;
  responsableOptions: string[];
  onChange: (patch: Partial<{
    dateFrom: string;
    dateTo: string;
    prioridad: string;
    categoria: string;
    responsable: string;
  }>) => void;
  onResetPreset: (days: number) => void;
}

export function ReportFilters({
  dateFrom,
  dateTo,
  prioridad,
  categoria,
  responsable,
  responsableOptions,
  onChange,
  onResetPreset,
}: ReportFiltersProps) {
  const inputClass =
    "px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-all";

  return (
    <div className="print:hidden bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium mr-1">
        {[
          { label: "7d", days: 7 },
          { label: "30d", days: 30 },
          { label: "90d", days: 90 },
        ].map((preset) => (
          <button
            key={preset.days}
            type="button"
            onClick={() => onResetPreset(preset.days)}
            className="px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onChange({ dateFrom: e.target.value })}
        className={inputClass}
      />
      <span className="text-xs text-slate-400">a</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onChange({ dateTo: e.target.value })}
        className={inputClass}
      />

      <select value={prioridad} onChange={(e) => onChange({ prioridad: e.target.value })} className={inputClass}>
        <option value="all">Toda prioridad</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>

      <select value={categoria} onChange={(e) => onChange({ categoria: e.target.value })} className={inputClass}>
        <option value="all">Toda categoría</option>
        <option value="ui_design">Diseño / UI</option>
        <option value="ux_flow">Comportamiento / UX</option>
        <option value="qa_test">Prueba Manual QA</option>
      </select>

      <select
        value={responsable}
        onChange={(e) => onChange({ responsable: e.target.value })}
        className={inputClass}
      >
        <option value="all">Todo responsable</option>
        {responsableOptions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
