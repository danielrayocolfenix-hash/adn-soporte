import type { ClientTicket } from "@/modules/dashboard/types/dashboard.types";

export const RECENT_TICKETS_MOCK_DATA: ClientTicket[] = [
  {
    id: "TCK-408",
    client: "Banco Bolivariano",
    avatar: "BB",
    issue: "Error 500 al procesar lote de transferencias masivas en producción.",
    category: "Fallo de Integración",
    priority: "critica",
    status: "En Proceso",
    createdAt: "Hace 15 min",
  },
  {
    id: "TCK-407",
    client: "Licores del Norte",
    avatar: "LN",
    issue: "Solicitud de prueba QA antes de liberar el módulo de facturación.",
    category: "Solicitud QA",
    priority: "alta",
    status: "Abierto",
    createdAt: "Hace 1 hora",
  },
  {
    id: "TCK-406",
    client: "Farmacias Saluda",
    avatar: "FS",
    issue: "Inconsistencia en los reportes de inventario al descargar PDF.",
    category: "Error de Sistema",
    priority: "media",
    status: "En Proceso",
    createdAt: "Hace 3 horas",
  },
  {
    id: "TCK-405",
    client: "Transportes Ecuador",
    avatar: "TE",
    issue: "Duda sobre la renovación de tokens OAuth en la API v2.",
    category: "Consulta",
    priority: "media",
    status: "Resuelto",
    createdAt: "Ayer",
  },
  {
    id: "TCK-404",
    client: "Grupo Retail S.A.",
    avatar: "GR",
    issue: "Timeouts aleatorios durante la sincronización de caja nocturna.",
    category: "Fallo de Integración",
    priority: "alta",
    status: "Abierto",
    createdAt: "Ayer",
  },
];

export const QA_RUNS_FEED_MOCK_DATA = [
  { id: "1092", title: "OAuth2 Refresh Token Flow", time: "Hace 10m", status: "passed" as const },
  { id: "1091", title: "Stripe Card Declined Event", time: "Hace 45m", status: "failed" as const },
  { id: "1090", title: "User Profile Validation", time: "Hace 2h", status: "passed" as const },
];
