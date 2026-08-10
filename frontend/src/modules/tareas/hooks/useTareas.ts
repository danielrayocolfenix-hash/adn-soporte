import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTarea,
  deleteTarea,
  getTarea,
  listTareas,
  updateTarea,
  updateTareaEstado,
} from "@/modules/tareas/services/tareaApi";
import type { TareaEstado, TareaFormValues, TareaRecord } from "@/modules/tareas/types/tarea.types";

const TAREAS_QUERY_KEY = ["tareas"] as const;

// 1. Obtener el listado completo de tareas
export function useTareaList() {
  return useQuery({ 
    queryKey: TAREAS_QUERY_KEY, 
    queryFn: listTareas 
  });
}

// 2. 🟢 FALTABA: Obtener el detalle de una tarea por ID
export function useGetTarea(id: string) {
  return useQuery({
    queryKey: [...TAREAS_QUERY_KEY, id],
    queryFn: () => getTarea(id),
    enabled: Boolean(id),
  });
}

// 3. Crear nueva tarea
export function useCreateTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TareaFormValues) => createTarea(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY }),
  });
}

// 4. 🟢 FALTABA: Actualizar la tarea completa (formulario de edición)
export function useUpdateTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: TareaFormValues }) =>
      updateTarea(id, values),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...TAREAS_QUERY_KEY, variables.id] });
    },
  });
}

// 5. Actualización optimista del estado (para arrastrar en el Kanban)
export function useUpdateTareaEstado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: TareaEstado }) =>
      updateTareaEstado(id, estado),
    onMutate: async ({ id, estado }) => {
      await queryClient.cancelQueries({ queryKey: TAREAS_QUERY_KEY });
      const previous = queryClient.getQueryData<TareaRecord[]>(TAREAS_QUERY_KEY);

      queryClient.setQueryData<TareaRecord[]>(TAREAS_QUERY_KEY, (current) =>
        current?.map((tarea) => (tarea.id === id ? { ...tarea, estado } : tarea)),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TAREAS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY }),
  });
}

// 6. Eliminar tarea
export function useDeleteTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTarea(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY }),
  });
}