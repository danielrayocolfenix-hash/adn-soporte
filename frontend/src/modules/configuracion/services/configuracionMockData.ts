import { Bell, Mail, Server, Shield, Sliders, Smartphone, Webhook } from "lucide-react";

import type {
  ConfiguracionTab,
  GeneralSettings,
  IntegrationStatus,
  NotificationSettings,
  SecuritySettings,
} from "@/modules/configuracion/types/configuracion.types";

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  projectName: "ADN QA Platform",
  defaultEnv: "Staging",
  theme: "system",
  language: "es",
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailOnFailure: true,
  emailDailyDigest: false,
  slackAlerts: true,
  webhookEvents: true,
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactor: true,
  sessionTimeout: "30",
  apiKey: "adn_live_9f8a3b2c1d0e4f5a6b7c8d9e",
};

export const CONFIG_TABS: { id: ConfiguracionTab; label: string; icon: typeof Sliders }[] = [
  { id: "general", label: "General", icon: Sliders },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "seguridad", label: "Seguridad & Acceso", icon: Shield },
  { id: "integraciones", label: "Integraciones & Webhooks", icon: Webhook },
];

export const NOTIFICATION_ITEMS_CONFIG: {
  key: keyof NotificationSettings;
  label: string;
  desc: string;
  icon: typeof Mail;
}[] = [
  {
    key: "emailOnFailure",
    label: "Notificar fallos por Correo",
    desc: "Recibe un email inmediato cuando una prueba crítica falle.",
    icon: Mail,
  },
  {
    key: "emailDailyDigest",
    label: "Resumen diario de ejecución",
    desc: "Un reporte consolidado todas las mañanas.",
    icon: Mail,
  },
  {
    key: "slackAlerts",
    label: "Alertas en Canal de Slack / Teams",
    desc: "Envía eventos de ejecución a canales de soporte.",
    icon: Smartphone,
  },
  {
    key: "webhookEvents",
    label: "Disparar Webhooks en tiempo real",
    desc: "Notifica a endpoints externos en eventos de QA.",
    icon: Server,
  },
];

export const INTEGRATIONS_MOCK_DATA: IntegrationStatus[] = [
  {
    name: "GitHub Actions",
    desc: "Ejecuta tests automáticamente en cada PR.",
    status: "Conectado",
  },
  {
    name: "GitLab CI",
    desc: "Sincroniza pipelines y reportes en tiempo real.",
    status: "Desconectado",
  },
  {
    name: "Cypress Cloud",
    desc: "Sincronización de videos y screenshots de QA.",
    status: "Conectado",
  },
  {
    name: "Jira Software",
    desc: "Creación automática de incidencias por fallos.",
    status: "Desconectado",
  },
];
