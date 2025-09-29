import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { LoginCredentials, User } from '../../lib/auth';
import type { AuthResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ 
      data: {
        user: User; 
        token: string;
        message: string;
      };
      message: string;
    }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        user: data.data.user,
        token: data.data.token,
      }),
      'Login failed'
    );
  } catch (error) {
    return handleApiError(error, 'Login failed');
  }
}
