import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Eye,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Search,
  type LucideIcon,
} from "lucide-react";

import { KanbanColumn } from "@/modules/tareas/components/KanbanColumn";
import { NuevaTareaModal } from "@/modules/tareas/components/NuevaTareaModal";
import { TareaCard } from "@/modules/tareas/components/TareaCard";
import { useDeleteTarea, useTareaList, useUpdateTareaEstado } from "@/modules/tareas/hooks/useTareas";
import type { TareaEstado, TareaRecord } from "@/modules/tareas/types/tarea.types";

const COLUMNS: { id: TareaEstado; title: string; icon: LucideIcon; accentClassName: string }[] = [
  { id: "hacer", title: "Hacer", icon: Circle, accentClassName: "bg-slate-500/10 text-slate-500" },
  { id: "en_curso", title: "En curso", icon: RefreshCw, accentClassName: "bg-sky-500/10 text-sky-500" },
  { id: "en_proceso", title: "En proceso QA", icon: Eye, accentClassName: "bg-amber-500/10 text-amber-500" },
  { id: "terminado", title: "Terminado", icon: CheckCircle2, accentClassName: "bg-emerald-500/10 text-emerald-500" },
  { id: "cerrado", title: "Cerrado", icon: Lock, accentClassName: "bg-indigo-500/10 text-indigo-500" },
];

export function TareasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  const { data: tareas, isLoading, isError } = useTareaList();
  const updateEstado = useUpdateTareaEstado();
  const deleteTarea = useDeleteTarea();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const filteredTareas = (tareas ?? []).filter((tarea) =>
    tarea.titulo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (tarea: TareaRecord) => {
    if (window.confirm(`¿Eliminar la tarea "${tarea.titulo}"? Esta acción no se puede deshacer.`)) {
      deleteTarea.mutate(tarea.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const nuevoEstado = over.id as TareaEstado;
    const tarea = tareas?.find((t) => t.id === active.id);
    if (!tarea || tarea.estado === nuevoEstado) return;

    updateEstado.mutate({ id: tarea.id, estado: nuevoEstado });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ClipboardCheck className="size-6 text-emerald-500" />
            Tareas de desarrollo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tablero Kanban de tareas: desde el desarrollo hasta el deploy y el cierre por QA. Las
            pruebas QA registradas generan aquí su tarea vinculada automáticamente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-sm transition-all shadow-emerald-600/20"
        >
          <Plus size={18} />
          Agregar nueva tarea
        </button>
      </div>

      {/* Resumen por estado */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            Todas las tareas
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold bg-white/20 dark:bg-slate-900/10">
              {tareas?.length ?? 0}
            </span>
          </span>
          {COLUMNS.map((col) => {
            const count = (tareas ?? []).filter((t) => t.estado === col.id).length;
            return (
              <span
                key={col.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                {col.title}
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold ${col.accentClassName}`}
                >
                  {count}
                </span>
              </span>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72 sm:ml-auto">
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

      {/* Tablero */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Cargando tareas...
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-rose-500 text-sm">
          <AlertTriangle size={20} />
          No fue posible cargar las tareas. Verifique que el backend esté corriendo y que haya
          iniciado sesión.
        </div>
      )}

      {!isLoading && !isError && (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-2">
            {COLUMNS.map((col) => {
              const items = filteredTareas.filter((t) => t.estado === col.id);
              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  icon={col.icon}
                  count={items.length}
                  accentClassName={col.accentClassName}
                >
                  {items.map((tarea) => (
                    <TareaCard key={tarea.id} tarea={tarea} onDelete={handleDelete} />
                  ))}
                  {items.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400">Sin tareas</div>
                  )}
                </KanbanColumn>
              );
            })}
          </div>
        </DndContext>
      )}

      {showNewModal && <NuevaTareaModal onClose={() => setShowNewModal(false)} />}
    </div>
  );
}
