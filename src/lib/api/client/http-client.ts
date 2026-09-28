import { createApiClient, type ApiClient } from "./create-api-client";

type SessionBridge = {
  getAccessToken: () => string | undefined;
  refresh: () => Promise<string>;
  onRefreshFailure: () => void;
};

let sessionBridge: SessionBridge | null = null;

let refreshPromise: Promise<string> | null = null;

export function configureHttpSession(bridge: SessionBridge) {
  sessionBridge = bridge;
}

async function refreshAccessToken() {
  if (!sessionBridge) {
    throw new Error("No authenticated session is available.");
  }

  refreshPromise ??= sessionBridge.refresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export function getHttpAccessToken() {
  return sessionBridge?.getAccessToken();
}

export async function refreshHttpAccessToken() {
  return refreshAccessToken();
}

export function handleHttpRefreshFailure() {
  sessionBridge?.onRefreshFailure();
}

export const httpClient: ApiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  getAccessToken: () => sessionBridge?.getAccessToken(),
  refreshAccessToken,
  onRefreshFailure: () => sessionBridge?.onRefreshFailure(),
});
