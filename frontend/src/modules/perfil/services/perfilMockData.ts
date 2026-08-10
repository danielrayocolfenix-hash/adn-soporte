import type {
  PreferencesData,
  ProfileData,
  SecurityData,
} from "@/modules/perfil/types/perfil.types";

export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "",
  email: "",
  role: "",
  phone: "",
  department: "",
  bio: "",
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
