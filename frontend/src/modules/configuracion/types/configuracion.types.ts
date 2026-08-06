export type ConfiguracionTab = "general" | "notificaciones" | "seguridad" | "integraciones";

export interface GeneralSettings {
  projectName: string;
  defaultEnv: string;
  theme: string;
  language: string;
}

export interface NotificationSettings {
  emailOnFailure: boolean;
  emailDailyDigest: boolean;
  slackAlerts: boolean;
  webhookEvents: boolean;
}

export interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: string;
  apiKey: string;
}

export interface IntegrationStatus {
  name: string;
  desc: string;
  status: "Conectado" | "Desconectado";
}
