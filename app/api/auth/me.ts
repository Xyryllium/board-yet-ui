import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { User } from '../../lib/auth';
import { handleApiResponse, handleApiError } from '../utils';
import { getAuthToken } from '../../lib/auth';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return null;
    }
    
    apiClient.setAuthToken(token);
    
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    
    return handleApiResponse(
      response,
      (data) => data,
      'Failed to get current user'
    );
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}
