import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createQa, deleteQa, getQa, listQa, updateQa } from "@/modules/qa/services/qaApi";
import type { QaFormValues } from "@/modules/qa/types/qa.types";

const QA_QUERY_KEY = ["qa"] as const;

export function useQaList() {
  return useQuery({ queryKey: QA_QUERY_KEY, queryFn: listQa });
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY }),
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

export function useDeleteQa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQa(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QA_QUERY_KEY }),
  });
}
