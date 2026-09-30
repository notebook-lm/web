export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}
