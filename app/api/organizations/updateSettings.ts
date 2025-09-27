import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { OrganizationSettings } from '../../lib/tenancy';
import { handleApiResponse, handleApiError } from '../utils';

export interface UpdateOrganizationSettingsData {
  subdomain?: string;
  settings?: Partial<OrganizationSettings>;
}

export interface UpdateOrganizationSettingsResponse {
  success: boolean;
  organization?: any;
  error?: string;
}

export async function updateOrganizationSettings(
  organizationId: number,
  data: UpdateOrganizationSettingsData
): Promise<UpdateOrganizationSettingsResponse> {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.ORGANIZATION.UPDATE_SETTINGS.replace('{id}', organizationId.toString()),
      data
    );

    return handleApiResponse(
      response,
      (apiData) => ({
        success: true,
        organization: apiData,
      }),
      'Failed to update organization settings'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to update organization settings');
  }
}

export async function validateSubdomain(subdomain: string, organizationId?: number): Promise<{
  available: boolean;
  error?: string;
}> {
  try {
    const queryParams = new URLSearchParams({
      subdomain,
      ...(organizationId && { exclude: organizationId.toString() })
    });
    
    const response = await apiClient.get<{
      success: boolean;
      available: boolean;
      error?: string;
    }>(
      `${API_ENDPOINTS.ORGANIZATION.VALIDATE_SUBDOMAIN}?${queryParams.toString()}`
    );
    
    if (response.success && response.data) {
      return {
        available: response.data.available,
        error: response.data.available ? undefined : response.data.error
      };
    }
    
    return {
      available: false,
      error: response.error || "Subdomain is not available"
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : "Failed to validate subdomain"
    };
  }
}
