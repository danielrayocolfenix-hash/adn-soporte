import type { FAQItem } from "@/modules/centro_ayuda/types/centroAyuda.types";

export const FAQS_MOCK_DATA: FAQItem[] = [
  {
    id: "1",
    category: "Reportes & QA",
    question: "¿Cómo reporto una inconsistencia de diseño o UI?",
    answer:
      "Ve a la sección de Calidad (QA) y haz clic en 'Nuevo Reporte'. Selecciona la categoría 'Diseño / UI', adjunta el enlace de Figma/Penpot y agrega capturas o evidencias visuales del problema.",
  },
  {
    id: "2",
    category: "Reportes & QA",
    question: "¿Dónde puedo consultar el estado de un reporte de error?",
    answer:
      "Todos los reportes están centralizados en la vista principal de QA. Puedes filtrarlos por estado (Abierto, En Revisión, Resuelto) y por prioridad.",
  },
  {
    id: "3",
    category: "Cuenta & Acceso",
    question: "¿Cómo cambio mi contraseña o activo la autenticación en dos pasos?",
    answer:
      "Ingresa al módulo de 'Perfil' desde el menú lateral o superior, selecciona la pestaña 'Seguridad y Acceso' y allí podrás actualizar tus credenciales y activar el 2FA.",
  },
  {
    id: "4",
    category: "Navegación",
    question: "¿Qué debo hacer si una vista o módulo se queda cargando?",
    answer:
      "Verifica tu conexión a internet o intenta recargar la página (`Ctrl + F5`). Si el problema persiste, revisa si hay algún reporte de mantenimiento activo o notifícalo a soporte.",
  },
];
