import { API_ENDPOINTS, apiClient } from "~/lib/api";
import type { Column, ColumnResponse } from "../types";
import { handleApiError, handleApiResponse } from "../utils";

export async function getBoardColumns(
  boardId: number
): Promise<ColumnResponse> {
  try {
    const response = await apiClient.get<{ data: Column[] }>(
      API_ENDPOINTS.COLUMN.LIST.replace('{boardId}', boardId.toString())
    );

    return handleApiResponse(
      response,
      (apiData) => ({
        success: true,
        data: apiData.data
      }),
      'Failed to fetch board columns'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to fetch board columns');
  }
}
