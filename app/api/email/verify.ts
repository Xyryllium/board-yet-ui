import { apiClient, API_ENDPOINTS } from '../../lib/api';
import { handleApiResponse, handleApiError } from '../utils';

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function verifyEmail(id: string, hash: string): Promise<VerifyEmailResponse> {
  try {
    const response = await apiClient.get<{ 
      message: string;
    }>(`${API_ENDPOINTS.EMAIL.VERIFY}/${id}/${hash}`);

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        message: data.message,
      }),
      'Failed to verify email'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to verify email');
  }
}
