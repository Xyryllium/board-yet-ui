import { API_ENDPOINTS, apiClient } from "~/lib/api";
import type { Column, ColumnResponse } from "../types";
import { handleApiError, handleApiResponse } from "../utils";

interface ReorderColumnsData {
  boardId: number;
  columns: Array<{
    id: number;
    order: number;
  }>;
}

export async function reorderColumns(
  data: ReorderColumnsData
): Promise<ColumnResponse> {
  try {
    const response = await apiClient.put<{ message: string; data: Column[] }>(
      API_ENDPOINTS.COLUMN.REORDER,
      data
    );

    return handleApiResponse(
      response,
      (apiData) => ({
        success: true,
        message: apiData.message,
        data: apiData.data
      }),
      'Failed to reorder columns'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to reorder columns');
  }
}
