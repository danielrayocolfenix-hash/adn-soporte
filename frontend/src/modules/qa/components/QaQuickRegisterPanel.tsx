import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, CheckSquare, Layout, Loader2, ServerCrash, UserCheck, X, Zap } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { useCreateQa } from "@/modules/qa/hooks/useQa";
import type { NewReportCategory, QaAmbiente, QaFormValues, QaPrioridad } from "@/modules/qa/types/qa.types";

interface QaQuickRegisterPanelProps {
  onClose: () => void;
}

const CATEGORIA_OPTIONS: { value: NewReportCategory; icon: typeof Layout }[] = [
  { value: "ui_design", icon: Layout },
  { value: "ux_flow", icon: UserCheck },
  { value: "qa_test", icon: CheckSquare },
  { value: "server_error", icon: ServerCrash },
];

const CATEGORIA_LABELS: Partial<Record<NewReportCategory, string>> = {
  server_error: "Error de Servidor",
};

export function QaQuickRegisterPanel({ onClose }: QaQuickRegisterPanelProps) {
  const { t } = useTranslation();
  const createQa = useCreateQa();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<NewReportCategory>("qa_test");
  const [modulo, setModulo] = useState("Autenticación");
  const [ambiente, setAmbiente] = useState<QaAmbiente>("Staging");
  const [prioridad, setPrioridad] = useState<QaPrioridad>("media");
  const [codigoError, setCodigoError] = useState("");
  const [nota, setNota] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const values: QaFormValues = {
      titulo,
      categoria,
      modulo,
      ambiente,
      figma_url: "",
      device_or_browser: "",
      codigo_error: codigoError,
      resultado_esperado: "",
      resultado_obtenido: "",
      prioridad,
      imagenAntes: null,
      imagenDespues: null,
    };
    createQa.mutate(
      { values, pasos: nota },
      {
        onSuccess: () => {
          setTitulo("");
          setNota("");
          setCodigoError("");
          setJustSaved(true);
          titleInputRef.current?.focus();
          setTimeout(() => setJustSaved(false), 2500);
        },
      },
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap size={16} className="text-emerald-500" />
              {t("qa.quickRegister.title")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("qa.quickRegister.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form
          id="qa-quick-register-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          {createQa.isError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              {t("qa.form.submitError")}
            </div>
          )}

          {justSaved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs animate-in fade-in duration-150">
              <CheckCircle2 size={14} className="shrink-0" />
              {t("qa.quickRegister.savedToast")}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("qa.form.titleLabel")}
            </label>
            <input
              ref={titleInputRef}
              type="text"
              required
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={t("qa.form.titlePlaceholderOther")}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t("qa.form.categoryOnly")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIA_OPTIONS.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategoria(value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                    categoria === value
                      ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 ring-1 ring-emerald-500"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon
                    size={16}
                    className={categoria === value ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}
                  />
                  <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                    {CATEGORIA_LABELS[value] ?? t(`qa.categoria.${value}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {categoria === "server_error" && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Código de error / módulo afectado
              </label>
              <input
                type="text"
                value={codigoError}
                onChange={(e) => setCodigoError(e.target.value)}
                placeholder="Ej: 500, TimeoutError, /api/v1/qa/"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("qa.form.moduloLabel")}
              </label>
              <select
                value={modulo}
                onChange={(e) => setModulo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="Autenticación">{t("qa.form.moduloAutenticacion")}</option>
                <option value="Facturación">{t("qa.form.moduloFacturacion")}</option>
                <option value="Perfil de Usuario">{t("qa.form.moduloPerfil")}</option>
                <option value="Notificaciones">{t("qa.form.moduloNotificaciones")}</option>
                <option value="Dashboard">{t("qa.form.moduloDashboard")}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("qa.form.ambienteLabel")}
              </label>
              <select
                value={ambiente}
                onChange={(e) => setAmbiente(e.target.value as QaAmbiente)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="Staging">{t("qa.form.ambienteStaging")}</option>
                <option value="Development">{t("qa.form.ambienteDevelopment")}</option>
                <option value="Production">{t("qa.form.ambienteProduction")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t("qa.form.prioridadLabel")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["alta", "media", "baja"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrioridad(p)}
                  className={`py-2 rounded-xl border text-xs font-semibold uppercase transition-all ${
                    prioridad === p
                      ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500"
                      : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {t(`common.priority.${p}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("qa.quickRegister.noteLabel")}
            </label>
            <textarea
              rows={5}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder={t("qa.quickRegister.notePlaceholder")}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">{t("qa.quickRegister.noteHint")}</p>
          </div>
        </form>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="qa-quick-register-form"
            disabled={createQa.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
          >
            {createQa.isPending && <Loader2 size={16} className="animate-spin" />}
            {t("qa.quickRegister.submit")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
