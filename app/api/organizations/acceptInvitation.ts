import { API_ENDPOINTS, apiClient } from "~/lib/api";
import { handleApiError, handleApiResponse } from "../utils";
import type { InvitationResponse } from "../types";

export async function acceptInvitation(token: string): Promise<InvitationResponse> {
  try {
    const response = await apiClient.post<InvitationResponse>(
      API_ENDPOINTS.ORGANIZATION.ACCEPT_INVITATION,
      { token }
    );

    if (response.success && response.data?.status === 'user_not_registered') {
      return {
        success: true,
        status: 'user_not_registered',
        email: response.data.email || '',
        message: response.data.message || 'User is not registered.',
      };
    }

    return handleApiResponse(
        response,
        (data) => ({
            success: true,
            data: data
        }),
        'Failed to accept invitation'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to accept invitation');
  }
}