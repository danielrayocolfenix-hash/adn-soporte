import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import type { ExecutionRecord } from "@/modules/qa/types/qa.types";

export function ExecutionStatusBadge({ status }: { status: ExecutionRecord["status"] }) {
  switch (status) {
    case "passed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={13} /> Pasó
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle size={13} /> Falló
        </span>
      );
    case "aborted":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <AlertTriangle size={13} /> Cancelado
        </span>
      );
  }
}
