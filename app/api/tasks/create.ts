import { apiClient, API_ENDPOINTS } from '../../lib/api';
import type { CreateTaskData, TaskResponse, TaskApiResponse } from '../types';
import { handleApiResponse, handleApiError } from '../utils';

export async function createTask(
  data: CreateTaskData
): Promise<TaskResponse> {
  try {
    const requestData = {
      title: data.title,
      description: data.description || '',
      order: data.order || 1
    };

    const endpoint = API_ENDPOINTS.TASK.CREATE.replace('{columnId}', data.columnId.toString());
    
    const response = await apiClient.post<TaskApiResponse>(
      endpoint,
      requestData
    );
    
    return handleApiResponse(
      response,
      (data) => ({
        success: true,
        data: data,
        message: 'Task created successfully'
      }),
      'Failed to create  task'
    );

  } catch (error) {
    return handleApiError(error, 'Failed to create task');
  }
}
