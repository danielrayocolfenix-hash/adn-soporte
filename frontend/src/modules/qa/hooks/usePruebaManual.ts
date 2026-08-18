import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCaso,
  createSuite,
  deleteCaso,
  deleteSuite,
  listSuites,
  updateCasoEstado,
  updateCasoResultado,
} from "@/modules/qa/services/pruebaManualApi";
import type {
  CasoPruebaEstado,
  CasoPruebaFormValues,
  SuitePruebaFormValues,
} from "@/modules/qa/types/pruebaManual.types";

const SUITES_QUERY_KEY = ["qa-suites"] as const;

export function useSuiteList() {
  return useQuery({
    queryKey: SUITES_QUERY_KEY,
    queryFn: listSuites,
  });
}

export function useCreateSuite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: SuitePruebaFormValues) => createSuite(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUITES_QUERY_KEY }),
  });
}

export function useDeleteSuite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSuite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUITES_QUERY_KEY }),
  });
}

export function useCreateCaso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CasoPruebaFormValues) => createCaso(values),
    onSuccess: (caso) => {
      queryClient.invalidateQueries({ queryKey: SUITES_QUERY_KEY });
      // Cuando el caso queda vinculado como prueba de regresión de un QA,
      // ese QA también debe reflejar el nuevo caso (ver QaDetallePage).
      if (caso.qa_relacionado) {
        queryClient.invalidateQueries({ queryKey: ["qa"] });
      }
    },
  });
}

export function useUpdateCasoEstado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: CasoPruebaEstado }) =>
      updateCasoEstado(id, estado),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUITES_QUERY_KEY }),
  });
}

export function useUpdateCasoResultado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resultadoObtenido }: { id: string; resultadoObtenido: string }) =>
      updateCasoResultado(id, resultadoObtenido),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUITES_QUERY_KEY }),
  });
}

export function useDeleteCaso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCaso(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUITES_QUERY_KEY }),
  });
}
