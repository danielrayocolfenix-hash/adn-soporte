import { useState } from "react";
import { AlertTriangle, ClipboardList, Loader2, Plus, Search } from "lucide-react";

import { NuevaSuiteModal } from "@/modules/qa/components/NuevaSuiteModal";
import { SuiteCard } from "@/modules/qa/components/SuiteCard";
import { useDeleteSuite, useSuiteList } from "@/modules/qa/hooks/usePruebaManual";
import type { SuitePrueba } from "@/modules/qa/types/pruebaManual.types";

export function SuitesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const { data: suites, isLoading, isError } = useSuiteList();
  const deleteSuite = useDeleteSuite();

  const filteredSuites = (suites ?? []).filter((suite) =>
    suite.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (suite: SuitePrueba) => {
    if (
      window.confirm(
        `¿Eliminar la suite "${suite.nombre}" y sus ${suite.total_casos} casos? Esta acción no se puede deshacer.`,
      )
    ) {
      deleteSuite.mutate(suite.id);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ClipboardList className="size-6 text-emerald-500" />
            Pruebas manuales
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Suites y casos de prueba manual: qué se probó, con qué resultado y qué falta ejecutar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-sm transition-all shadow-emerald-600/20"
        >
          <Plus size={18} />
          Nueva suite
        </button>
      </div>

      {showNewModal && <NuevaSuiteModal onClose={() => setShowNewModal(false)} />}

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar suite..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <Loader2 size={16} className="animate-spin" />
          Cargando suites...
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-rose-500 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <AlertTriangle size={20} />
          No fue posible cargar las suites de prueba.
        </div>
      )}

      {!isLoading && !isError && filteredSuites.length === 0 && (
        <div className="py-16 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          Todavía no hay suites de prueba.
        </div>
      )}

      {!isLoading && !isError && filteredSuites.length > 0 && (
        <div className="space-y-3">
          {filteredSuites.map((suite) => (
            <SuiteCard key={suite.id} suite={suite} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
