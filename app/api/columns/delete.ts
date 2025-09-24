import { API_ENDPOINTS, apiClient } from "~/lib/api";
import type { ColumnResponse } from "../types";
import { handleApiError, handleApiResponse } from "../utils";

export async function deleteColumn(
  columnId: number
): Promise<ColumnResponse> {
  try {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.COLUMN.DELETE.replace('{id}', columnId.toString())
    );

    return handleApiResponse(
      response,
      (apiData) => ({
        success: true,
        message: apiData.message,
        data: undefined
      }),
      'Failed to delete column'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to delete column');
  }
}
