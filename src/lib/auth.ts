const TOKEN_KEY = "naabol_token";

export interface UserPayload {
  sub: string;
  email: string;
  nivel: "admin" | "operador";
  cod_usuario: string;
  nombre: string;
  aeropuerto: string;
  exp: number;
  iat: number;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): UserPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    return payload as UserPayload;
  } catch {
    removeToken();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
