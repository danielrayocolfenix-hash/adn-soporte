import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Clock, Loader2, Printer, ShieldCheck, TrendingUp } from "lucide-react";

import { CategoryBadge } from "@/modules/qa/components/CategoryBadge";
import { useQaList } from "@/modules/qa/hooks/useQa";
import type { QaEstado, QaPrioridad, QaRecord } from "@/modules/qa/types/qa.types";
import { CategoryBarChart } from "@/modules/reportes/components/CategoryBarChart";
import { ChartCard } from "@/modules/reportes/components/ChartCard";
import { EstadoBarChart } from "@/modules/reportes/components/EstadoBarChart";
import { ReportFilters } from "@/modules/reportes/components/ReportFilters";
import { StatTile } from "@/modules/reportes/components/StatTile";
import { PriorityBarChart } from "@/modules/reportes/components/PriorityBarChart";
import { TrendAreaChart } from "@/modules/reportes/components/TrendAreaChart";

const PRIORIDAD_ORDER: { key: QaPrioridad; label: string }[] = [
  { key: "baja", label: "Baja" },
  { key: "media", label: "Media" },
  { key: "alta", label: "Alta" },
];

const CATEGORIA_ORDER: { key: QaRecord["categoria"]; label: string }[] = [
  { key: "ui_design", label: "Diseño / UI" },
  { key: "ux_flow", label: "Comportamiento / UX" },
  { key: "qa_test", label: "Prueba Manual QA" },
];

const ESTADO_ORDER: { key: QaEstado; label: string }[] = [
  { key: "nueva", label: "Nueva" },
  { key: "en_proceso", label: "En proceso" },
  { key: "correccion", label: "Corrección" },
  { key: "pendiente_validacion", label: "Pend. validación" },
  { key: "validacion_final", label: "Validación final" },
  { key: "aprobada", label: "Aprobada" },
  { key: "rechazada", label: "Rechazada" },
  { key: "cerrada", label: "Cerrada" },
];

const ESTADOS_TERMINALES: QaEstado[] = ["aprobada", "validacion_final", "cerrada", "rechazada"];

const PRIORIDAD_BADGE: Record<QaPrioridad, string> = {
  alta: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  media: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  baja: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function toDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function formatFechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

export function ReportesPage() {
  const { data: qas, isLoading, isError } = useQaList();

  const [dateFrom, setDateFrom] = useState(toDateInput(daysAgo(30)));
  const [dateTo, setDateTo] = useState(toDateInput(new Date()));
  const [prioridad, setPrioridad] = useState("all");
  const [categoria, setCategoria] = useState("all");
  const [responsable, setResponsable] = useState("all");

  const responsableOptions = useMemo(() => {
    const names = new Set((qas ?? []).map((qa) => qa.responsable_nombre));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [qas]);

  const filtered = useMemo(() => {
    const from = new Date(`${dateFrom}T00:00:00`).getTime();
    const to = new Date(`${dateTo}T23:59:59`).getTime();
    return (qas ?? []).filter((qa) => {
      const createdAt = new Date(qa.created_at).getTime();
      if (createdAt < from || createdAt > to) return false;
      if (prioridad !== "all" && qa.prioridad !== prioridad) return false;
      if (categoria !== "all" && qa.categoria !== categoria) return false;
      if (responsable !== "all" && qa.responsable_nombre !== responsable) return false;
      return true;
    });
  }, [qas, dateFrom, dateTo, prioridad, categoria, responsable]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const altaCount = filtered.filter((qa) => qa.prioridad === "alta").length;
    const resueltas = filtered.filter((qa) => ESTADOS_TERMINALES.includes(qa.estado)).length;
    const abiertasAntiguas = filtered.filter(
      (qa) =>
        !ESTADOS_TERMINALES.includes(qa.estado) &&
        new Date(qa.created_at).getTime() < daysAgo(7).getTime(),
    ).length;

    return {
      total,
      altaCount,
      altaPct: total ? Math.round((altaCount / total) * 100) : 0,
      tasaResolucion: total ? Math.round((resueltas / total) * 100) : 0,
      abiertasAntiguas,
    };
  }, [filtered]);

  const byPrioridad = useMemo(
    () =>
      PRIORIDAD_ORDER.map(({ key, label }) => ({
        prioridad: key,
        label,
        total: filtered.filter((qa) => qa.prioridad === key).length,
      })),
    [filtered],
  );

  const byCategoria = useMemo(
    () =>
      CATEGORIA_ORDER.map(({ key, label }) => ({
        categoria: key,
        label,
        total: filtered.filter((qa) => qa.categoria === key).length,
      })),
    [filtered],
  );

  const byEstado = useMemo(
    () =>
      ESTADO_ORDER.map(({ key, label }) => ({
        estado: key,
        label,
        total: filtered.filter((qa) => qa.estado === key).length,
      })),
    [filtered],
  );

  const trend = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const qa of filtered) {
      const day = qa.created_at.slice(0, 10);
      buckets.set(day, (buckets.get(day) ?? 0) + 1);
    }
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, total]) => ({ label: formatFechaCorta(day), total }));
  }, [filtered]);

  const detailRows = useMemo(
    () => [...filtered].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [filtered],
  );

  const handlePreset = (days: number) => {
    setDateFrom(toDateInput(daysAgo(days)));
    setDateTo(toDateInput(new Date()));
  };

  return (
    <div className="space-y-6 pb-10 print:space-y-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5 print:text-black">
            <BarChart3 className="size-6 text-emerald-500 print:hidden" />
            Reporte de Calidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 print:text-slate-600">
            Resumen automático de las pruebas QA registradas, listo para presentar al líder de QA.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-sm transition-all shadow-emerald-600/20"
        >
          <Printer size={18} />
          Exportar / Imprimir PDF
        </button>
      </div>

      <ReportFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        prioridad={prioridad}
        categoria={categoria}
        responsable={responsable}
        responsableOptions={responsableOptions}
        onChange={(patch) => {
          if (patch.dateFrom !== undefined) setDateFrom(patch.dateFrom);
          if (patch.dateTo !== undefined) setDateTo(patch.dateTo);
          if (patch.prioridad !== undefined) setPrioridad(patch.prioridad);
          if (patch.categoria !== undefined) setCategoria(patch.categoria);
          if (patch.responsable !== undefined) setResponsable(patch.responsable);
        }}
        onResetPreset={handlePreset}
      />

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Cargando datos de QA...
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-rose-500 text-sm">
          <AlertTriangle size={20} />
          No fue posible cargar los datos para el reporte.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              label="Pruebas registradas"
              value={String(stats.total)}
              icon={ShieldCheck}
              iconClassName="bg-emerald-500/10 text-emerald-500"
              note="En el rango seleccionado"
            />
            <StatTile
              label="Prioridad alta"
              value={String(stats.altaCount)}
              icon={AlertTriangle}
              iconClassName="bg-rose-500/10 text-rose-500"
              note={`${stats.altaPct}% del total`}
            />
            <StatTile
              label="Tasa de resolución"
              value={`${stats.tasaResolucion}%`}
              icon={TrendingUp}
              iconClassName="bg-sky-500/10 text-sky-500"
              note="Aprobadas, validadas, rechazadas o cerradas"
            />
            <StatTile
              label="Abiertas hace +7 días"
              value={String(stats.abiertasAntiguas)}
              icon={Clock}
              iconClassName="bg-amber-500/10 text-amber-500"
              note="Requieren seguimiento prioritario"
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Por prioridad" subtitle="Distribución de severidad">
              <PriorityBarChart data={byPrioridad} />
            </ChartCard>
            <ChartCard title="Por categoría" subtitle="Tipo de incidencia detectada">
              <CategoryBarChart data={byCategoria} />
            </ChartCard>
            <ChartCard title="Tendencia de registros" subtitle="Pruebas QA creadas por día">
              <TrendAreaChart data={trend} />
            </ChartCard>
          </div>

          <ChartCard title="Por estado del flujo QA" subtitle="Dónde se encuentra cada prueba en su ciclo de vida">
            <EstadoBarChart data={byEstado} />
          </ChartCard>

          {/* Detalle */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden print:border-slate-300 print:shadow-none break-inside-avoid">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 print:border-slate-300">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 print:text-black">
                Detalle de pruebas QA ({detailRows.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400 print:text-slate-700">
                    <th className="py-3 px-4">Título</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Prioridad</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4">Creado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                  {detailRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                        No hay pruebas QA que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    detailRows.map((qa) => (
                      <tr key={qa.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 print:text-black">
                          {qa.titulo}
                        </td>
                        <td className="py-3 px-4">
                          <CategoryBadge category={qa.categoria} />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold border uppercase ${PRIORIDAD_BADGE[qa.prioridad]}`}
                          >
                            {qa.prioridad}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 print:text-slate-700">
                          {ESTADO_ORDER.find((e) => e.key === qa.estado)?.label ?? qa.estado}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 print:text-slate-700">
                          {qa.responsable_nombre}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-slate-400 print:text-slate-600">
                          {formatFechaCorta(qa.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
