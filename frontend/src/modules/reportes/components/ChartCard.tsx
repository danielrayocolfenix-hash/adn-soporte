import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, className = "" }: ChartCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs print:border-slate-300 print:shadow-none break-inside-avoid ${className}`}
    >
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 print:text-black">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 print:text-slate-600">
          {subtitle}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}
