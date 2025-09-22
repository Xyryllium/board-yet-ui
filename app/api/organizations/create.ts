import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { CreateOrganizationData, CreateOrganizationResponse, OrganizationDetails } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function createOrganization(
  data: CreateOrganizationData
): Promise<CreateOrganizationResponse> {
  try {
    const response = await apiClient.post<OrganizationDetails>(
      API_ENDPOINTS.ORGANIZATION.CREATE,
      data
    );

    return handleApiResponse(
      response,
      (organization) => ({
        success: true,
        organization,
      }),
      'Failed to create organization'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to create organization');
  }
}

