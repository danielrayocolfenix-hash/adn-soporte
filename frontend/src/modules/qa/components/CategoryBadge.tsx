import { CheckSquare, Layout, UserCheck } from "lucide-react";

import type { NewReportCategory } from "@/modules/qa/types/qa.types";

export function CategoryBadge({ category }: { category: NewReportCategory }) {
  switch (category) {
    case "ui_design":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Layout size={12} /> Diseño / UI
        </span>
      );
    case "ux_flow":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <UserCheck size={12} /> Comportamiento / UX
        </span>
      );
    case "qa_test":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckSquare size={12} /> Prueba Manual QA
        </span>
      );
  }
}
