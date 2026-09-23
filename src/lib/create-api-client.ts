import type { ApiErrorResponse } from "@/shared/types/api-error";

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string, body?: unknown): Promise<T>;
}

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | undefined;
  refreshAccessToken?: () => Promise<string>;
  onRefreshFailure?: () => void;
  onError?: (error: ApiRequestError) => void;
}

interface RequestOptions {
  body?: unknown;
  retryAfterRefresh?: boolean;
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly details: ApiErrorResponse | undefined;

  constructor(status: number, details?: ApiErrorResponse) {
    super(details?.message ?? "The request could not be completed.");
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const request = async <T>(
    method: string,
    path: string,
    { body, retryAfterRefresh = true }: RequestOptions = {},
  ): Promise<T> => {
    const accessToken = options.getAccessToken?.();
    const response = await fetch(`${options.baseUrl}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (
      response.status === 401 &&
      retryAfterRefresh &&
      !path.endsWith("/auth/refresh") &&
      options.refreshAccessToken
    ) {
      try {
        await options.refreshAccessToken();
        return request<T>(method, path, { body, retryAfterRefresh: false });
      } catch (error) {
        options.onRefreshFailure?.();
        throw error;
      }
    }

    if (!response.ok) {
      const details = await readError(response);
      const error = new ApiRequestError(response.status, details);
      options.onError?.(error);
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  };

  return {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body?: unknown) =>
      request<T>("POST", path, { body }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>("PATCH", path, { body }),
    delete: <T>(path: string, body?: unknown) =>
      request<T>("DELETE", path, { body }),
  };
}

async function readError(
  response: Response,
): Promise<ApiErrorResponse | undefined> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return undefined;
  }
}
