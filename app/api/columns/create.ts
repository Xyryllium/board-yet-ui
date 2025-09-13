import { API_ENDPOINTS, apiClient } from "~/lib/api";
import type { Column, ColumnResponse, CreateColumnData } from "../types";
import { handleApiError, handleApiResponse } from "../utils";

export async function createColumn(
    data: CreateColumnData
): Promise<ColumnResponse> {
    try {
        const response = await apiClient.post<{message: string, data: Column}>(
            API_ENDPOINTS.COLUMN.CREATE,
            data
        );

        return handleApiResponse(
            response,
            (apiData) => ({
                success: true,
                message: apiData.message,
                data: apiData.data
            }),
            'Failed to create column'
        )
    } catch (error) {
        return handleApiError(error, 'Failed to create column');
    }
}