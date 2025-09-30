import { apiClient, API_ENDPOINTS } from '../../lib/api';
import { handleApiResponse, handleApiError } from '../utils';

export interface ResendVerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function resendVerificationEmail(): Promise<ResendVerificationResponse> {
  try {
    const response = await apiClient.post<{ 
      message: string;
    }>(API_ENDPOINTS.EMAIL.RESEND);

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        message: data.message,
      }),
      'Failed to resend verification email'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to resend verification email');
  }
}
