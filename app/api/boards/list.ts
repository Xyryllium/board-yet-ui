import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { Board, BoardResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function fetchBoards(): Promise<BoardResponse> {
  try {
    const response = await apiClient.get<{success: boolean, data: Board[], message: string}>(
      API_ENDPOINTS.BOARD.LIST
    );

    return handleApiResponse(
      response,
      (apiResponse) => ({
        success: true,
        data: apiResponse.data,
        message: apiResponse.message
      }),
      'Failed to fetch boards'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to fetch boards');
  }
}

