import { API_ENDPOINTS, apiClient } from "~/lib/api";
import { handleApiError, handleApiResponse } from "../utils";

export async function deleteTask(taskId: string): Promise<{ success: boolean; data?: any; error?: string; message?: string }> {
 try {
    const endpoint = API_ENDPOINTS.TASK.DELETE.replace('{id}', taskId);
    const response = await apiClient.delete(endpoint);

    return handleApiResponse(
        response,
        (task) => ({
            success: true,
            data: task,
            message: 'Task deleted successfully'
        }),
        'Failed to delete task'
    )
 } catch (error) {
    return handleApiError(error, 'Failed to delete task');
 }
}
