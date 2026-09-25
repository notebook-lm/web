import { ApiRequestError } from "@/lib/api/client/create-api-client";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) {
    return getNonEmptyMessage(error.details?.message) ?? fallback;
  }

  if (error instanceof Error) {
    return getNonEmptyMessage(error.message) ?? fallback;
  }

  return fallback;
}

function getNonEmptyMessage(message: unknown): string | undefined {
  return typeof message === "string" && message.trim() ? message.trim() : undefined;
}
