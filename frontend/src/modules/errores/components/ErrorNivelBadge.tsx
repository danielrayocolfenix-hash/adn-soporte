import { AlertTriangle, Skull, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ErrorNivel } from "@/modules/errores/types/errores.types";

const NIVEL_STYLES: Record<ErrorNivel, { icon: typeof AlertTriangle; className: string }> = {
  warning: {
    icon: TriangleAlert,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  error: {
    icon: AlertTriangle,
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  critical: {
    icon: Skull,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
};

export function ErrorNivelBadge({ nivel }: { nivel: ErrorNivel }) {
  const { t } = useTranslation();
  const { icon: Icon, className } = NIVEL_STYLES[nivel];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
    >
      <Icon size={13} /> {t(`errores.nivel.${nivel}`)}
    </span>
  );
}
