import { useState, type FormEvent } from "react";
import { ChevronDown, ClipboardList, Loader2, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  CASO_ESTADO_BAR_STYLES,
  CASO_ESTADO_LABELS,
  CASO_ESTADO_ORDER,
  CASO_ESTADO_STYLES,
} from "@/modules/qa/constants/casoPrueba";
import { useCreateCaso, useDeleteCaso, useUpdateCasoEstado } from "@/modules/qa/hooks/usePruebaManual";
import type { CasoPruebaEstado, SuitePrueba } from "@/modules/qa/types/pruebaManual.types";

interface SuiteCardProps {
  suite: SuitePrueba;
  onDelete: (suite: SuitePrueba) => void;
}

function ProgressBar({ suite }: { suite: SuitePrueba }) {
  if (suite.total_casos === 0) {
    return <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800" />;
  }

  const segments: { estado: CasoPruebaEstado; count: number }[] = [
    { estado: "pass", count: suite.pass_count },
    { estado: "fail", count: suite.fail_count },
    { estado: "blocked", count: suite.blocked_count },
    { estado: "not_tested", count: suite.not_tested_count },
  ];

  return (
    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
      {segments.map(
        ({ estado, count }) =>
          count > 0 && (
            <div
              key={estado}
              className={CASO_ESTADO_BAR_STYLES[estado]}
              style={{ width: `${(count / suite.total_casos) * 100}%` }}
            />
          ),
      )}
    </div>
  );
}

function CasoRow({ casoId, nombre, resultadoEsperado, estado, qaRelacionadoTitulo, qaRelacionadoId }: {
  casoId: string;
  nombre: string;
  resultadoEsperado: string;
  estado: CasoPruebaEstado;
  qaRelacionadoTitulo: string | null;
  qaRelacionadoId: string | null;
}) {
  const updateEstado = useUpdateCasoEstado();
  const deleteCaso = useDeleteCaso();

  return (
    <div className="flex items-start gap-2.5 py-2.5 px-1 border-b border-slate-100 dark:border-slate-800/70 last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 dark:text-slate-200 truncate">{nombre}</p>
        {resultadoEsperado && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{resultadoEsperado}</p>
        )}
        {qaRelacionadoId && (
          <Link
            to={`/qa/detalle/${qaRelacionadoId}`}
            className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            Regresión de: {qaRelacionadoTitulo}
          </Link>
        )}
      </div>
      <select
        value={estado}
        onChange={(e) =>
          updateEstado.mutate({ id: casoId, estado: e.target.value as CasoPruebaEstado })
        }
        disabled={updateEstado.isPending}
        className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase cursor-pointer focus:outline-none disabled:opacity-50 ${CASO_ESTADO_STYLES[estado]}`}
      >
        {CASO_ESTADO_ORDER.map((e) => (
          <option key={e} value={e}>
            {CASO_ESTADO_LABELS[e]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`¿Eliminar el caso "${nombre}"?`)) {
            deleteCaso.mutate(casoId);
          }
        }}
        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors shrink-0"
        title="Eliminar caso"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export function SuiteCard({ suite, onDelete }: SuiteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddCaso, setShowAddCaso] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEsperado, setNuevoEsperado] = useState("");
  const createCaso = useCreateCaso();

  const handleAddCaso = (e: FormEvent) => {
    e.preventDefault();
    createCaso.mutate(
      {
        suite: suite.id,
        nombre: nuevoNombre,
        precondiciones: "",
        pasos: "",
        resultado_esperado: nuevoEsperado,
        qa_relacionado: null,
      },
      {
        onSuccess: () => {
          setNuevoNombre("");
          setNuevoEsperado("");
          setShowAddCaso(false);
        },
      },
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3.5 px-5 py-4 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center justify-center size-9 rounded-xl shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ClipboardList size={17} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
              {suite.nombre}
            </p>
            {suite.porcentaje_exito !== null && (
              <span
                className={`shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                  suite.porcentaje_exito >= 80
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : suite.porcentaje_exito >= 50
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {suite.porcentaje_exito}% éxito
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            <ProgressBar suite={suite} />
          </p>
          <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{suite.total_casos} casos</span>
            {suite.pass_count > 0 && <span className="text-emerald-600 dark:text-emerald-400">{suite.pass_count} pass</span>}
            {suite.fail_count > 0 && <span className="text-rose-600 dark:text-rose-400">{suite.fail_count} fail</span>}
            {suite.blocked_count > 0 && <span className="text-amber-600 dark:text-amber-400">{suite.blocked_count} blocked</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(suite);
          }}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          title="Eliminar suite"
        >
          <Trash2 size={15} />
        </button>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/70 bg-slate-50/40 dark:bg-slate-950/20">
          {suite.casos.length === 0 && !showAddCaso && (
            <p className="py-4 text-center text-xs text-slate-400">Sin casos todavía.</p>
          )}

          {suite.casos.map((caso) => (
            <CasoRow
              key={caso.id}
              casoId={caso.id}
              nombre={caso.nombre}
              resultadoEsperado={caso.resultado_esperado}
              estado={caso.estado}
              qaRelacionadoId={caso.qa_relacionado}
              qaRelacionadoTitulo={caso.qa_relacionado_titulo}
            />
          ))}

          {showAddCaso ? (
            <form onSubmit={handleAddCaso} className="flex items-center gap-2 pt-3">
              <input
                type="text"
                required
                autoFocus
                placeholder="Nombre del caso"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <input
                type="text"
                placeholder="Resultado esperado (opcional)"
                value={nuevoEsperado}
                onChange={(e) => setNuevoEsperado(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                disabled={createCaso.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-all disabled:opacity-50 shrink-0"
              >
                {createCaso.isPending ? <Loader2 size={13} className="animate-spin" /> : "Agregar"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddCaso(false)}
                className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCaso(true)}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
            >
              <Plus size={13} /> Agregar caso
            </button>
          )}
        </div>
      )}
    </div>
  );
}
