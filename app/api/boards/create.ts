import { API_ENDPOINTS, apiClient } from "~/lib/api";
import type { Board, BoardResponse, CreateBoardData } from "../types";
import { handleApiError, handleApiResponse } from "../utils";

export async function createBoard(
    data: CreateBoardData
): Promise<BoardResponse> {
    try {
        const response = await apiClient.post<{message: string, data: Board}>(
            API_ENDPOINTS.BOARD.CREATE,
            data
        );

        return handleApiResponse(
            response,
            (apiData) => ({
                success: true,
                message: apiData.message,
                data: apiData.data
            }),
            'Failed to create board'
        )
    } catch (error) {
        return handleApiError(error, 'Failed to create board');
    }
}