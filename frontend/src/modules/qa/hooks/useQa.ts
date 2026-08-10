import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createQa, deleteQa, getQa, listQa, updateQa, updateQaSolucion } from "@/modules/qa/services/qaApi";
import type { QaFormValues } from "@/modules/qa/types/qa.types";
import { probarEndpoint } from "@/modules/errores/services/probarApi";
import { useMemo } from "react";

const QA_QUERY_KEY = ["qa"] as const;

export function useQaList() {
  const query = useQuery({
    queryKey: QA_QUERY_KEY,
    queryFn: listQa,
  });

  const groupedByPriority = useMemo(() => {
    return (query.data ?? []).reduce<Record<string, typeof query.data>>(
      (groups, qa) => {
        const priority = qa.prioridad;
        if (!groups[priority]) {
          groups[priority] = [];
        }
        groups[priority].push(qa);
        return groups;
      },
      {},
    );
  }, [query.data]);

  return {
    ...query,
    groupedByPriority,
  };
}

export function useQaDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...QA_QUERY_KEY, id],
    queryFn: () => getQa(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateQa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ values, pasos }: { values: QaFormValues; pasos: string }) =>
      createQa(values, pasos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
  });
}

export function useUpdateQa(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ values, pasos }: { values: QaFormValues; pasos: string }) =>
      updateQa(id, values, pasos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY }),
  });
}

export function useUpdateQaSolucion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resultadoObtenido }: { id: string; resultadoObtenido: string }) =>
      updateQaSolucion(id, resultadoObtenido),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY }),
  });
}

export function useDeleteQa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQa(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY }),
  });
}

export function useProbarEndpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ url, qaTicketId }: { url: string; qaTicketId?: string }) =>
      probarEndpoint(url, qaTicketId),
    onSuccess: (result) => {
      if (result.error_group) {
        queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY });
      }
    },
  });
}
