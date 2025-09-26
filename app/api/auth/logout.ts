import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { LogoutResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT
    );

    const result = handleApiResponse(
      response,
      () => ({
        success: true,
        message: 'Logged out successfully',
      }),
      'Logout failed'
    );

    return result;
  } catch (error) {
    return handleApiError(error, 'Logout failed');
  }
}

