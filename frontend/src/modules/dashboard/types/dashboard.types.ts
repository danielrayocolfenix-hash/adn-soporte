export interface ClientTicket {
  id: string;
  client: string;
  avatar: string;
  issue: string;
  category: "Error de Sistema" | "Consulta" | "Fallo de Integración" | "Solicitud QA";
  priority: "alta" | "media" | "critica";
  status: "Abierto" | "En Proceso" | "Resuelto";
  createdAt: string;
}
