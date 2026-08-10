import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Play,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  MessageSquare,
  AlertTriangle,
  LifeBuoy,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { PriorityBadge } from "@/modules/dashboard/components/PriorityBadge";
import { TicketStatusBadge } from "@/modules/dashboard/components/TicketStatusBadge";
import {
  QA_RUNS_FEED_MOCK_DATA,
  RECENT_TICKETS_MOCK_DATA,
} from "@/modules/dashboard/services/dashboardMockData";

export function DashboardPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-6 pb-10">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="size-6 text-emerald-500" />
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 shadow-xs"
          >
            <option value="24h">{t("dashboard.range24h")}</option>
            <option value="7d">{t("dashboard.range7d")}</option>
            <option value="30d">{t("dashboard.range30d")}</option>
          </select>

          <Link
            to="/qa/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-emerald-600/20"
          >
            <Plus size={16} />
            {t("dashboard.newTest")}
          </Link>
        </div>
      </div>

      {/* Tarjetas KPI de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("dashboard.kpi.successRate")}
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">94.2%</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={14} /> +2.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashboard.kpi.successRateNote")}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("dashboard.kpi.testsRun")}
            </span>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,284</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={14} /> +14%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashboard.kpi.testsRunNote")}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("dashboard.kpi.activeTickets")}
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <LifeBuoy size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">5</h3>
            <span className="inline-flex items-center text-xs font-semibold text-rose-500">
              <AlertTriangle size={14} className="mr-0.5" /> {t("dashboard.kpi.activeTicketsCritical")}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashboard.kpi.activeTicketsNote")}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("dashboard.kpi.criticalErrors")}
            </span>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
              <XCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">3</h3>
            <span className="inline-flex items-center text-xs font-semibold text-rose-500">
              <ArrowDownRight size={14} /> -1
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t("dashboard.kpi.criticalErrorsNote")}</p>
        </div>
      </div>

      {/* NUEVA SECCIÓN: ÚLTIMOS 5 TICKETS DE CLIENTES */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="size-5 text-indigo-500" />
              {t("dashboard.tickets.title")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("dashboard.tickets.subtitle")}
            </p>
          </div>
          <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
            {t("dashboard.tickets.viewHelpDesk")}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {RECENT_TICKETS_MOCK_DATA.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Info Cliente e Novedad */}
              <div className="flex items-start gap-3 flex-1">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                  {ticket.avatar}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ticket.client}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">({ticket.id})</span>
                    <PriorityBadge priority={ticket.priority} />
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 font-medium">
                      {t(`dashboard.ticketCategory.${ticket.category}`)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ticket.issue}</p>
                </div>
              </div>

              {/* Estado y Tiempo */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800/60 pt-2 md:pt-0">
                <span className="text-xs font-mono text-slate-400">{ticket.createdAt}</span>
                <div className="w-28 text-right">
                  <TicketStatusBadge status={ticket.status} />
                </div>
                <button
                  type="button"
                  className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title={t("dashboard.tickets.convertToQa")}
                >
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección Inferior: Ejecuciones de QA y Estado de Salud */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Barra Visual de Cobertura QA */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t("dashboard.health.title")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("dashboard.health.subtitle")}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              {t("dashboard.health.stable")}
            </span>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[82%]" title="Aprobadas: 82%" />
              <div className="bg-rose-500 h-full w-[8%]" title="Fallidas: 8%" />
              <div className="bg-amber-500 h-full w-[6%]" title="Pendientes: 6%" />
              <div className="bg-slate-400 h-full w-[4%]" title="Sin ejecutar: 4%" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {t("dashboard.health.approved")} (82%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {t("dashboard.health.failed")} (8%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {t("dashboard.health.pending")} (6%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feed de Actividad Reciente QA */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("dashboard.runsFeed.title")}
            </h2>
            <Link
              to="/qa/historial"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="space-y-3">
            {QA_RUNS_FEED_MOCK_DATA.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {item.status === "passed" && (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  )}
                  {item.status === "failed" && (
                    <XCircle size={16} className="text-rose-500 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      QA-{item.id} • {item.time}
                    </p>
                  </div>
                </div>
                <Link
                  to="/qa/historial"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <Play size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
