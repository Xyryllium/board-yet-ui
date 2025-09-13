import { API_ENDPOINTS, apiClient } from "~/lib/api";
import type { Column, ColumnResponse } from "../types";
import { handleApiError, handleApiResponse } from "../utils";

interface UpdateColumnData {
  boardId: number;
  name: string;
  order: number;
}

export async function updateColumn(
  columnId: number,
  data: UpdateColumnData
): Promise<ColumnResponse> {
  try {
    const response = await apiClient.put<{ message: string; data: Column }>(
      API_ENDPOINTS.COLUMN.UPDATE.replace('{id}', columnId.toString()),
      data
    );

    return handleApiResponse(
      response,
      (apiData) => ({
        success: true,
        message: apiData.message,
        data: apiData.data
      }),
      'Failed to update column'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to update column');
  }
}
