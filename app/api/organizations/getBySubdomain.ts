import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { OrganizationDetails } from '../types';
import type { TenantOrganization, OrganizationSettings } from '../../lib/tenancy';
import { handleApiError, handleApiResponse } from '../utils';

export interface GetOrganizationBySubdomainResponse {
  success: boolean;
  data?: TenantOrganization;
  error?: string;
}

export async function getOrganizationBySubdomain(subdomain: string): Promise<GetOrganizationBySubdomainResponse> {
  try {
    const response = await apiClient.get<{success: boolean, data: OrganizationDetails}>(
      `/organizations/subdomain/${subdomain}`
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
    return handleApiError(error, 'Failed to fetch organization by subdomain');
  }
}
