export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("access_token"));
}

export function clearSession(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
