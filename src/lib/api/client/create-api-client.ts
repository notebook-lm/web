import axios, { type AxiosInstance, type Method } from "axios";
import type { ApiErrorResponse } from "@/shared/errors/api-error";

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  getBlob(path: string): Promise<Blob>;
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
  responseType?: "blob";
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
  const client = createAxiosClient(options);

  const request = async <T>(
    method: Method,
    path: string,
    { body, retryAfterRefresh = true, responseType }: RequestOptions = {},
  ): Promise<T> => {
    try {
      const response = await client.request<T>({
        method,
        url: path,
        data: body,
        responseType,
      });

      return response.data;
    } catch (error) {
      const apiError = toApiRequestError(error);

      if (
        apiError.status === 401 &&
        retryAfterRefresh &&
        !path.endsWith("/auth/login") &&
        !path.endsWith("/auth/refresh") &&
        options.refreshAccessToken
      ) {
        try {
          await options.refreshAccessToken();
          return request<T>(method, path, {
            body,
            retryAfterRefresh: false,
            responseType,
          });
        } catch (refreshError) {
          options.onRefreshFailure?.();
          throw refreshError;
        }
      }

      options.onError?.(apiError);
      throw apiError;
    }
  };

  return {
    get: <T>(path: string) => request<T>("GET", path),
    getBlob: (path: string) => request<Blob>("GET", path, { responseType: "blob" }),
    post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>("PATCH", path, { body }),
    delete: <T>(path: string, body?: unknown) =>
      request<T>("DELETE", path, { body }),
  };
}

function createAxiosClient(options: ApiClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseUrl,
    headers: { Accept: "application/json" },
  });

  client.interceptors.request.use((config) => {
    const accessToken = options.getAccessToken?.();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  return client;
}

function toApiRequestError(error: unknown): ApiRequestError {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiRequestError(0, { message: "Network request failed." });
  }

  return new ApiRequestError(error.response?.status ?? 0, error.response?.data);
}
