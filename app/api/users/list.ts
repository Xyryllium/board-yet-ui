import { API_ENDPOINTS, apiClient } from "~/lib/api";
import { handleApiError, handleApiResponse } from "../utils";
import type { Member } from "~/api/types";

export async function listAllUsers(organizationId: number) {
    try {
        const endpoint = API_ENDPOINTS.USER.LIST.replace('{organizationId}', organizationId.toString());
        const response = await apiClient.get<{success: boolean, data: Member[]}>(
            endpoint
        );

        return handleApiResponse(
            response,
            (apiResponse) => ({
                success: true,
                members: apiResponse.data
            }),
            'Failed to list users',
        );
        
    } catch (error) {
        return handleApiError(error, 'Failed to list users');
    }
}