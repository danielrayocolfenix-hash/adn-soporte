import type { CurrentUser } from "@/modules/auth/types/auth.types";

export function getDisplayName(user: CurrentUser): string {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  return fullName || user.username;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const initials = parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  return initials.toUpperCase();
}
