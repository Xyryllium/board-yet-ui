import type { Member } from "~/lib/member";
import type { InvitationResponse } from "../types";
import { API_ENDPOINTS, apiClient } from "../../lib/api";
import { handleApiError, handleApiResponse } from "../utils";


export async function memberInvite(memberInfo: Member, organizationId: number): Promise<InvitationResponse> {
  try {
    const endpoint = API_ENDPOINTS.ORGANIZATION.INVITE.replace('{id}', organizationId.toString());
    const response = await apiClient.post<{ message: string; invitation: any }>(
      endpoint,
      memberInfo
    );

    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        message: data.message,
        invitation: data.invitation,
      }),
      'Invitation failed'
    );
  } catch (error) {
    return handleApiError(error, 'Invitation failed');
  }
}