import type { CreateTaskData } from "~/api/types";
import { createTask, deleteTask, updateTask } from "~/lib/task";

export function useTasks() {
    const handleAddTask = async (task: CreateTaskData, onSuccess: (newTask: any) => void, onError: (error: string) => void ) => {
        try {
            const response = await createTask(task);
            
            if (response.success && response.data) {
                onSuccess(response.data);
            } else {
                onError(response.error || 'Failed to add task');
            }
        } catch (error) {
            onError('An error occurred while adding task');
        }
    };

    const handleUpdateTask = async (taskId: string, updates: {
        title?: string;
        description?: string;
        column_id?: number;
        order?: number;
    }, onSuccess?: (updatedTask: any) => void, onError?: (error: string) => void) => {
        try {
            const response = await updateTask(taskId, updates);
            
            if (response.success && response.data) {
                onSuccess?.(response.data);
            } else {
                onError?.(response.error || 'Failed to update task');
            }
        } catch (error) {
            onError?.('An error occurred while updating task');
        }
    };

    const handleDeleteTask = async (taskId: string, onSuccess?: (updatedTask: any) => void, onError?: (error: string) => void) => {
        try {
            const response = await deleteTask(taskId);

            if (response.success && response.data) {
                onSuccess?.(response.data);
            } else {
                onError?.(response.error || 'Failed to delete task');
            }
        } catch (error) {
            onError?.('An error occurred while deleting task');
        }
    };

    return {
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask
    };
}