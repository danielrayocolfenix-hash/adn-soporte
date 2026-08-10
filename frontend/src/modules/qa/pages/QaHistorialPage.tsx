import { useState } from "react";
import { Clock, Cpu, Download, FileText, History, RotateCcw, Search, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ExecutionStatusBadge } from "@/modules/qa/components/ExecutionStatusBadge";
import { QA_HISTORIAL_MOCK_DATA } from "@/modules/qa/services/qaMockData";

export function QaHistorialPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [triggerFilter, setTriggerFilter] = useState<string>("all");

  const filteredHistory = QA_HISTORIAL_MOCK_DATA.filter((record) => {
    const matchesSearch =
      record.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.triggeredBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    const matchesTrigger = triggerFilter === "all" || record.triggerType === triggerFilter;

    return matchesSearch && matchesStatus && matchesTrigger;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <History className="size-6 text-emerald-500" />
            {t("qa.historial.title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("qa.historial.subtitle")}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-xl transition-all"
        >
          <Download size={16} />
          {t("qa.historial.exportReport")}
        </button>
      </div>

      {/* Tarjetas KPI de Rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("qa.historial.kpiTotal")}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">148</h3>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              {t("qa.historial.kpiTotalNote")}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("qa.historial.kpiSuccessRate")}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">92.4%</h3>
            <span className="text-xs font-medium text-slate-400">
              {t("qa.historial.kpiSuccessRateNote")}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("qa.historial.kpiAvgDuration")}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">1m 38s</h3>
            <span className="text-xs font-medium text-slate-400">
              {t("qa.historial.kpiAvgDurationNote")}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("qa.historial.kpiCriticalFailures")}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">3</h3>
            <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
              {t("qa.historial.kpiCriticalFailuresNote")}
            </span>
          </div>
        </div>
      </div>

      {/* Controles y Filtros de Búsqueda */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Input Búsqueda */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("qa.historial.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-all"
          />
        </div>

        {/* Grupos de Filtros */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* Filtro por Disparador */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTriggerFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                triggerFilter === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {t("qa.historial.triggerAll")}
            </button>
            <button
              onClick={() => setTriggerFilter("auto")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                triggerFilter === "auto"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Cpu size={12} /> {t("qa.historial.triggerAuto")}
            </button>
            <button
              onClick={() => setTriggerFilter("manual")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                triggerFilter === "manual"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <User size={12} /> {t("qa.historial.triggerManual")}
            </button>
          </div>

          {/* Filtro por Estado */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium">
            {[
              { id: "all", label: t("qa.historial.statusAll") },
              { id: "passed", label: t("qa.historial.statusPassed") },
              { id: "failed", label: t("qa.historial.statusFailed") },
              { id: "aborted", label: t("qa.historial.statusAborted") },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === st.id
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla del Historial de Ejecuciones */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-6">{t("qa.historial.columnSuite")}</th>
                <th className="py-3.5 px-6">{t("qa.historial.columnTrigger")}</th>
                <th className="py-3.5 px-6">{t("qa.historial.columnResults")}</th>
                <th className="py-3.5 px-6">{t("qa.historial.columnDuration")}</th>
                <th className="py-3.5 px-6">{t("qa.historial.columnStatus")}</th>
                <th className="py-3.5 px-6 text-right">{t("qa.historial.columnActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* ID y Nombre */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          {record.suiteName}
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400">
                            {record.environment}
                          </span>
                        </span>
                        <span className="text-xs font-mono text-slate-400 mt-0.5">
                          {record.id} • {record.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Disparador */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {record.triggerType === "auto" ? (
                          <Cpu className="size-3.5 text-indigo-500" />
                        ) : (
                          <User className="size-3.5 text-emerald-500" />
                        )}
                        <span>{record.triggeredBy}</span>
                      </div>
                    </td>

                    {/* Pruebas Pasadas / Fallidas */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {record.passedCount} ✓
                        </span>
                        {record.failedCount > 0 && (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">
                            {record.failedCount} ✗
                          </span>
                        )}
                        <span className="text-slate-400">/ {record.totalCount} total</span>
                      </div>
                    </td>

                    {/* Duración */}
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        {record.duration}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-6">
                      <ExecutionStatusBadge status={record.status} />
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title={t("qa.historial.viewLog")}
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title={t("qa.historial.rerun")}
                        >
                          <RotateCcw size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    {t("qa.historial.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
