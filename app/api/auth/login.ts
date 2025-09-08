import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { LoginCredentials } from '../../lib/auth';
import type { AuthResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ user: any; token: string }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        user: data.user,
        token: data.token,
      }),
      'Login failed'
    );
  } catch (error) {
    return handleApiError(error, 'Login failed');
  }
}
