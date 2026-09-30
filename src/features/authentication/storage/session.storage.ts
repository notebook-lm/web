import type { AuthSession } from "../model";

const key = "notebook-lm.session";

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") return false;

  const session = value as Record<string, unknown>;
  const user = session.user;

  return (
    typeof session.accessToken === "string" &&
    typeof session.refreshToken === "string" &&
    typeof session.tokenType === "string" &&
    typeof session.expiresIn === "number" &&
    Boolean(user) &&
    typeof user === "object" &&
    typeof (user as Record<string, unknown>).id === "string" &&
    typeof (user as Record<string, unknown>).email === "string" &&
    typeof (user as Record<string, unknown>).displayName === "string"
  );
}

export function getSession(): AuthSession | null {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    const session: unknown = JSON.parse(value);
    return isAuthSession(session) ? session : null;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(key, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(key);
}
