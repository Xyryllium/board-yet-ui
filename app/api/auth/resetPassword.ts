import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { AuthResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export async function resetPassword(request: ResetPasswordRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ 
      success: boolean;
      message: string;
      data?: any;
    }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      request
    );

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        message: data.message,
      }),
      'Failed to reset password'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to reset password');
  }
}
