import type {
  PreferencesData,
  ProfileData,
  SecurityData,
} from "@/modules/perfil/types/perfil.types";

export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "Alex Morgan",
  email: "alex.morgan@empresa.com",
  role: "Líder de Calidad / QA Engineer",
  phone: "+57 300 123 4567",
  department: "Tecnología & Producto",
  bio: "Especialista en QA, automatización de pruebas y aseguramiento de UI/UX.",
};

export const DEFAULT_SECURITY_DATA: SecurityData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  twoFactorEnabled: true,
};

export const DEFAULT_PREFERENCES_DATA: PreferencesData = {
  emailNotifications: true,
  qaAlerts: true,
  language: "es",
};
