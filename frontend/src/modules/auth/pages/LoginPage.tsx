import { useState, type FormEvent } from "react";
import { AlertTriangle, Loader2, Lock, SquareTerminal, User, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, type Location } from "react-router-dom";

import { useLogin } from "@/modules/auth/hooks/useLogin";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/dashboard";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password }, { onSuccess: () => navigate(from, { replace: true }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
          <SquareTerminal size={20} />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t("auth.title")}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t("auth.subtitle")}</p>
      </div>

      {login.isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
          <AlertTriangle size={14} className="shrink-0" />
          {t("auth.error")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t("auth.username")}
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t("auth.password")}
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
        >
          {login.isPending && <Loader2 size={16} className="animate-spin" />}
          {login.isPending ? t("auth.submitting") : t("auth.submit")}
        </button>
      </form>
    </div>
  );
}
