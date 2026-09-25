import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
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

export function getApiFieldErrors(
  error: unknown,
  fields?: readonly string[],
): Record<string, string> {
  if (!(error instanceof ApiRequestError)) return {};

  return Object.fromEntries(
    Object.entries(error.details?.fieldErrors ?? {}).filter(
      ([field, message]) =>
        (!fields || fields.includes(field)) && getNonEmptyMessage(message),
    ),
  ) as Record<string, string>;
}

export function setApiFieldErrors<T extends FieldValues>(
  error: unknown,
  fields: readonly Path<T>[],
  setError: UseFormSetError<T>,
): boolean {
  const fieldErrors = getApiFieldErrors(error);
  let hasFieldError = false;

  for (const field of fields) {
    const message = getNonEmptyMessage(fieldErrors[field]);
    if (!message) continue;

    setError(field, { type: "server", message });
    hasFieldError = true;
  }

  return hasFieldError;
}

function getNonEmptyMessage(message: unknown): string | undefined {
  return typeof message === "string" && message.trim() ? message.trim() : undefined;
}
