import type { ApiResponse } from '../lib/api';

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  successCallback: (data: T) => any,
  errorMessage: string = 'Operation failed'
) {
  if (response.success && response.data) {
    return successCallback(response.data);
  }

  return {
    success: false,
    error: response.error || errorMessage,
  };
}

export function handleApiError(error: unknown, defaultMessage: string = 'An unexpected error occurred') {
  return {
    success: false,
    error: error instanceof Error ? error.message : defaultMessage,
  };
}
