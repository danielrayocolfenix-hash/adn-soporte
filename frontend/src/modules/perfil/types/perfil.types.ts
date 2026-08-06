export type ActiveTab = "personal" | "security" | "preferences";

export interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  bio: string;
}

export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

export interface PreferencesData {
  emailNotifications: boolean;
  qaAlerts: boolean;
  language: string;
}
