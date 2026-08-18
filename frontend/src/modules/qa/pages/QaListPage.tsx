import { useState } from "react";
import {
  AlertTriangle,
  CheckSquare,
  Layout,
  Loader2,
  Search,
  ServerCrash,
  SquareCheckBig,
  UserCheck,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { QaCard } from "@/modules/qa/components/QaCard";
import { QaQuickRegisterPanel } from "@/modules/qa/components/QaQuickRegisterPanel";
import { useDeleteQa, useQaList } from "@/modules/qa/hooks/useQa";
import type { NewReportCategory, QaPrioridad } from "@/modules/qa/types/qa.types";

const CATEGORIA_FILTERS: {
  value: NewReportCategory | "all";
  label: string;
  icon?: typeof Layout;
  activeClassName: string;
}[] = [
  {
    value: "all",
    label: "Todas",
    activeClassName: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900",
  },
  {
    value: "ui_design",
    label: "Diseño / UI",
    icon: Layout,
    activeClassName: "bg-purple-600 text-white",
  },
  {
    value: "ux_flow",
    label: "Comportamiento / UX",
    icon: UserCheck,
    activeClassName: "bg-sky-600 text-white",
  },
  {
    value: "qa_test",
    label: "Prueba Manual QA",
    icon: CheckSquare,
    activeClassName: "bg-emerald-600 text-white",
  },
  {
    value: "server_error",
    label: "Error de Servidor",
    icon: ServerCrash,
    activeClassName: "bg-rose-600 text-white",
  },
];

const CATEGORIA_GROUPS: {
  value: NewReportCategory;
  label: string;
  icon: typeof Layout;
  text: string;
}[] = [
  { value: "ui_design", label: "Diseño / UI", icon: Layout, text: "text-purple-600 dark:text-purple-400" },
  { value: "ux_flow", label: "Comportamiento / UX", icon: UserCheck, text: "text-sky-600 dark:text-sky-400" },
  { value: "qa_test", label: "Prueba Manual QA", icon: CheckSquare, text: "text-emerald-600 dark:text-emerald-400" },
  { value: "server_error", label: "Error de Servidor", icon: ServerCrash, text: "text-rose-600 dark:text-rose-400" },
];

const PRIORITY_GROUPS: {
  key: QaPrioridad;
  label: string;
  className: string;
}[] = [
  { key: "alta", label: "Alta", className: "text-rose-600 dark:text-rose-400" },
  { key: "media", label: "Media", className: "text-amber-600 dark:text-amber-400" },
  { key: "baja", label: "Baja", className: "text-emerald-600 dark:text-emerald-400" },
];

const priorityOrder = (prioridad: QaPrioridad) =>
  PRIORITY_GROUPS.findIndex((group) => group.key === prioridad);

export function QaListPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<NewReportCategory | "all">("all");
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const { data: items, groupedByPriority, isLoading, isError } = useQaList();
  const deleteQa = useDeleteQa();

  const filteredItems = (items ?? []).filter((item) => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoria = categoriaFilter === "all" || item.categoria === categoriaFilter;
    return matchesSearch && matchesCategoria;
  });

  const handleDelete = (id: string, titulo: string) => {
    if (window.confirm(t("qa.list.deleteConfirm", { titulo }))) {
      deleteQa.mutate(id);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <SquareCheckBig className="size-6 text-emerald-500" />
            {t("qa.list.title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("qa.list.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowQuickRegister(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-sm transition-all shadow-emerald-600/20"
        >
          <Zap size={18} />
          {t("qa.quickRegister.title")}
        </button>
      </div>

      {showQuickRegister && (
        <QaQuickRegisterPanel onClose={() => setShowQuickRegister(false)} />
      )}

      {/* Búsqueda y filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("qa.list.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIA_FILTERS.map((filter) => {
            const Icon = filter.icon;
            const count =
              filter.value === "all"
                ? (items ?? []).length
                : (items ?? []).filter((item) => item.categoria === filter.value).length;
            const isActive = categoriaFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setCategoriaFilter(filter.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? `${filter.activeClassName} shadow-sm`
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {Icon && <Icon size={13} />}
                {filter.label}
                <span
                  className={`inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-semibold ${
                    isActive ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resumen por prioridad */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Prioridad
          </span>
          {PRIORITY_GROUPS.map((group) => (
            <span
              key={group.key}
              className={`inline-flex items-center gap-1.5 text-xs font-medium ${group.className}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {group.label}
              <span className="font-semibold">{(groupedByPriority[group.key] ?? []).length}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Loader2 size={16} className="animate-spin" />
          {t("qa.list.loading")}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-rose-500 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <AlertTriangle size={20} />
          {t("qa.list.loadError")}
        </div>
      )}

      {!isLoading && !isError && filteredItems.length === 0 && (
        <div className="py-16 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {t("qa.list.empty")}
        </div>
      )}

      {!isLoading && !isError && filteredItems.length > 0 && (
        <div className="space-y-8">
          {CATEGORIA_GROUPS.map((group) => {
            const groupItems = filteredItems
              .filter((item) => item.categoria === group.value)
              .sort((a, b) => priorityOrder(a.prioridad) - priorityOrder(b.prioridad));
            if (groupItems.length === 0) return null;
            const Icon = group.icon;

            return (
              <div key={group.value} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={group.text} />
                  <h2 className={`text-sm font-semibold tracking-wide uppercase ${group.text}`}>
                    {group.label}
                  </h2>
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {groupItems.length}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {groupItems.map((item) => (
                    <QaCard key={item.id} qa={item} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
