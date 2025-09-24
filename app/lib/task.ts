import type { TaskResponse, CreateTaskData } from "~/api/types";
import { createTask as apiCreateTask } from "~/api/tasks/create";
import { updateTask as apiUpdateTask } from "~/api/tasks/update";
import { deleteTask as apiDeleteTask } from "~/api/tasks/delete";

export async function createTask(data: CreateTaskData): Promise<TaskResponse> {
  return apiCreateTask(data);
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    column_id?: number;
    order?: number;
  }
): Promise<{ success: boolean; data?: any; error?: string }> {
  return apiUpdateTask(taskId, data);
}

export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; data?: any; error?: string; message?: string }> {
  return apiDeleteTask(taskId);
}
