import { API_ENDPOINTS, apiClient } from "~/lib/api";
import { handleApiError, handleApiResponse } from "../utils";
import type { OrganizationDetails } from "../types";

export async function listOrganizationDetails(token: string) {
  try {
    const endpoint = API_ENDPOINTS.ORGANIZATION.LIST.replace('{token}', token);
    const response = await apiClient.get<{success: boolean, data: OrganizationDetails}>(
        endpoint
    );
    return handleApiResponse(
        response,
        (apiResponse) => ({
            success: true,
            data: apiResponse.data
        }),
        'Failed to list organization details',
    );
  } catch (error) {
    return handleApiError(error, 'Failed to list organization details');
  }
}
