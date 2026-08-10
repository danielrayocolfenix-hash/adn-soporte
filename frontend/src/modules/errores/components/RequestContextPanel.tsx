import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { ErrorDetalle } from "@/modules/errores/types/errores.types";

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm text-slate-800 dark:text-slate-200 break-words">{value || "—"}</p>
    </div>
  );
}

export function RequestContextPanel({ error }: { error: ErrorDetalle }) {
  const { t } = useTranslation();

  const queryParamsEntries = Object.entries(error.query_params ?? {});
  const headerEntries = Object.entries(error.headers ?? {});

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Field label={t("errores.detalle.metodo")} value={error.http_method} />
        <Field label={t("errores.detalle.ruta")} value={error.path} />
        <Field label={t("errores.detalle.ambiente")} value={error.ambiente} />
        <Field label={t("errores.detalle.usuario")} value={error.usuario_nombre} />
        <Field label={t("errores.detalle.ip")} value={error.ip_address} />
      </div>

      {queryParamsEntries.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {t("errores.detalle.queryParams")}
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
            {queryParamsEntries.map(([key, value]) => (
              <div key={key} className="flex gap-3 px-3.5 py-2 text-xs font-mono">
                <span className="text-slate-500 shrink-0">{key}</span>
                <span className="text-slate-800 dark:text-slate-200 break-all">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {headerEntries.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {t("errores.detalle.headers")}
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
            {headerEntries.map(([key, value]) => (
              <div key={key} className="flex gap-3 px-3.5 py-2 text-xs font-mono">
                <span className="text-slate-500 shrink-0">{key}</span>
                <span className="text-slate-800 dark:text-slate-200 break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
