import { useState } from "react";
import { AlertTriangle, Loader2, Pencil, Plus, Search, SquareCheckBig, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { CategoryBadge } from "@/modules/qa/components/CategoryBadge";
import { useDeleteQa, useQaList } from "@/modules/qa/hooks/useQa";

const PRIORIDAD_STYLES: Record<string, string> = {
  alta: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  media: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  baja: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function QaListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: items, isLoading, isError } = useQaList();
  console.log(items);
  const deleteQa = useDeleteQa();

  const filteredItems = (items ?? []).filter((item) =>
    item.titulo.toLowerCase().includes(searchQuery.toLowerCase()),
  );


  const handleDelete = (id: string, titulo: string) => {
    if (window.confirm(`¿Eliminar la prueba "${titulo}"? Esta acción no se puede deshacer.`)) {
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
            Pruebas QA
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reportes de diseño, UX y pruebas manuales registrados por el equipo.
          </p>
        </div>

        <Link
          to="/qa/nueva"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-sm transition-all shadow-emerald-600/20"
        >
          <Plus size={18} />
          Nueva prueba
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Cargando pruebas QA...
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-rose-500 text-sm">
            <AlertTriangle size={20} />
            No fue posible cargar las pruebas QA. Verifique que el backend esté corriendo y que haya
            iniciado sesión.
          </div>
        )}

        {!isLoading && !isError && filteredItems.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">
            No hay pruebas QA registradas todavía.
          </div>
        )}

        {!isLoading && !isError && filteredItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Título</th>
                  <th className="py-3.5 px-6">Categoría</th>
                  <th className="py-3.5 px-6">Módulo / Ambiente</th>
                  <th className="py-3.5 px-6">Prioridad</th>
                  <th className="py-3.5 px-6">Responsable</th>
                  <th className="py-3.5 px-6">Creado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {item.titulo}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <CategoryBadge category={item.categoria} />
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col">
                        <span>{item.modulo}</span>
                        <span className="text-xs font-mono text-slate-400">{item.ambiente}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold border uppercase ${PRIORIDAD_STYLES[item.prioridad]}`}
                      >
                        {item.prioridad}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      {item.responsable_nombre}
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-slate-400">
                      {formatFecha(item.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/qa/detalle/${item.id}`}
                          className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.titulo)}
                          disabled={deleteQa.isPending}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
