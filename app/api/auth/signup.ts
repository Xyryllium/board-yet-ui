import { API_ENDPOINTS, apiClient } from "../../lib/api";
import type { SignupCredentials, User } from "../../lib/auth";
import type { AuthResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function signupUser(credentials: SignupCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ 
      data: { 
        user: User; 
        token: string; 
      }; 
      message: string; 
    }>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        user: data.data.user,
        token: data.data.token,
      }),
      'Signup failed'
    );
  } catch (error) {
    return handleApiError(error, 'Signup failed');
  }
}