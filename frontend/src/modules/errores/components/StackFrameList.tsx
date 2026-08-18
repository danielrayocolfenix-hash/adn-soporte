import { useState } from "react";
import { ChevronDown, Code2, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { StackFrame } from "@/modules/errores/types/errores.types";

function FrameItem({ frame, index }: { frame: StackFrame; index: number }) {
  const [isOpen, setIsOpen] = useState(frame.in_app);

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        frame.in_app
          ? "border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10"
          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left"
      >
        {frame.in_app ? (
          <Code2 size={15} className="shrink-0 text-rose-500" />
        ) : (
          <Package size={15} className="shrink-0 text-slate-400" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-mono text-slate-700 dark:text-slate-300">
            {frame.file}:{frame.line}
            {frame.column != null && `:${frame.column}`}
            <span className="text-slate-400 dark:text-slate-500"> en </span>
            {frame.function}
          </p>
        </div>
        {frame.in_app && (
          <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-600 dark:text-rose-400">
            app
          </span>
        )}
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-950 px-0 py-2 overflow-x-auto">
          <pre className="font-mono text-xs leading-6">
            {frame.context_lines.map((contextLine) => (
              <div
                key={`${index}-${contextLine.line}`}
                className={`px-3.5 whitespace-pre ${
                  contextLine.line === frame.line
                    ? "bg-rose-500/20 text-rose-100"
                    : "text-slate-400"
                }`}
              >
                <span className="inline-block w-10 select-none text-slate-600">
                  {contextLine.line}
                </span>
                {contextLine.text}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

export function StackFrameList({ frames }: { frames: StackFrame[] }) {
  const { t } = useTranslation();

  if (frames.length === 0) {
    return <p className="text-sm text-slate-400">{t("errores.detalle.noFrames")}</p>;
  }

  return (
    <div className="space-y-2">
      {frames.map((frame, index) => (
        <FrameItem key={`${frame.file}-${frame.line}-${index}`} frame={frame} index={index} />
      ))}
    </div>
  );
}
