import { CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ClientTicket } from "@/modules/dashboard/types/dashboard.types";

export function TicketStatusBadge({ status }: { status: ClientTicket["status"] }) {
  const { t } = useTranslation();

  switch (status) {
    case "Abierto":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
          <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
          {t("dashboard.ticketStatus.Abierto")}
        </span>
      );
    case "En Proceso":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
          <Clock size={12} /> {t("dashboard.ticketStatus.En Proceso")}
        </span>
      );
    case "Resuelto":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
          <CheckCircle2 size={12} /> {t("dashboard.ticketStatus.Resuelto")}
        </span>
      );
  }
}
