import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { TaskApiResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    column_id?: number;
    order?: number;
  }
): Promise<{ success: boolean; data?: TaskApiResponse; error?: string }> {
  try {
    const endpoint = API_ENDPOINTS.TASK.UPDATE.replace('{id}', taskId);
    
    const response = await apiClient.put<TaskApiResponse>(
      endpoint,
      data
    );

    return handleApiResponse(
      response,
      (task) => ({
        success: true,
        data: task,
        message: 'Task updated successfully'
      }),
      'Failed to update task'
    );
  } catch (error) {
    return handleApiError(error, 'Failed to update task');
  }
}
