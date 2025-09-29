import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { AuthResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(request: ForgotPasswordRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ 
      success: boolean;
      message: string;
      data?: any;
    }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      request
    );

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        message: data.message,
      }),
      'Failed to send password reset email'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to send password reset email');
  }
}
