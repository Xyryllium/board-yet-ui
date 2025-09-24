import { useState, useCallback } from 'react';
import { useTasks } from '~/hooks/useTasks';
import type { Task, TaskUpdateData } from '~/components/board/types';

interface UseTaskManagementProps {
    onError: (error: string) => void;
    onSuccess: (message: string) => void;
}

export function useTaskManagement({ onError, onSuccess }: UseTaskManagementProps) {
    const tasksHook = useTasks();
    const [tasks, setTasks] = useState<Task[]>([]);

    const updateTask = useCallback(async (
        taskId: string, 
        updates: TaskUpdateData,
        originalTasks?: Task[]
    ) => {
        const previousTasks = originalTasks || [...tasks];
        
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId 
                    ? { ...task, ...updates }
                    : task
            )
        );

        tasksHook.handleUpdateTask(
            taskId,
            updates,
            () => {
                onSuccess('Task updated successfully');
            },
            (error) => {
                setTasks(previousTasks);
                onError(error || 'Failed to update task');
            }
        );
    }, [tasks, tasksHook, onError, onSuccess]);

    const moveTask = useCallback(async (
        taskId: string, 
        fromColumnId: number,
        toColumnId: number
    ) => {
        const previousTasks = [...tasks];
        
        const taskToMove = tasks.find(task => task.id === taskId);
        if (!taskToMove) {
            onError('Task not found');
            return;
        }
        
        if (taskToMove.columnId !== fromColumnId) {
            onError('Task is not in the expected column');
            return;
        }
        
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId 
                    ? { ...task, columnId: toColumnId }
                    : task
            )
        );

        tasksHook.handleUpdateTask(
            taskId,
            { column_id: toColumnId },
            () => {
                onSuccess(`Task moved from column ${fromColumnId} to column ${toColumnId}`);
            },
            (error) => {
                setTasks(previousTasks);
                onError(error || 'Failed to move task');
            }
        );
    }, [tasks, tasksHook, onError, onSuccess]);

    const calculateNewOrder = useCallback((
        task: Task,
        taskId: string,
        fromOrder: number,
        toOrder: number
    ): number | undefined => {
        if (task.id === taskId) {
            return toOrder;
        }
        
        if (task.order === undefined) return undefined;
        
        if (fromOrder < toOrder) {
            if (task.order > fromOrder && task.order <= toOrder) {
                return task.order - 1;
            }
        } else if (fromOrder > toOrder) {
            if (task.order >= toOrder && task.order < fromOrder) {
                return task.order + 1;
            }
        }
        
        return task.order;
    }, []);

    const shouldUpdateTask = useCallback((
        task: Task,
        taskId: string,
        fromOrder: number,
        toOrder: number
    ): boolean => {
        if (task.id === taskId) return true;
        
        if (task.order === undefined) return false;
        
        if (fromOrder < toOrder) {
            return task.order > fromOrder && task.order <= toOrder;
        } else if (fromOrder > toOrder) {
            return task.order >= toOrder && task.order < fromOrder;
        }
        
        return false;
    }, []);

    const updateUI = useCallback((
        prevTasks: Task[],
        taskId: string,
        fromOrder: number,
        toOrder: number,
        columnId: number
    ): Task[] => {
        const columnTasks = prevTasks.filter(task => task.columnId === columnId);
        const otherTasks = prevTasks.filter(task => task.columnId !== columnId);
        
        const reorderedTasks = columnTasks.map(task => {
            const newOrder = calculateNewOrder(task, taskId, fromOrder, toOrder);
            return newOrder !== undefined ? { ...task, order: newOrder } : task;
        });
        
        return [...otherTasks, ...reorderedTasks];
    }, [calculateNewOrder]);

    const updateDatabase = useCallback(async (
        tasks: Task[],
        taskId: string,
        fromOrder: number,
        toOrder: number,
        columnId: number
    ): Promise<void> => {
        const columnTasks = tasks.filter(task => task.columnId === columnId);
        const tasksToUpdate = columnTasks.filter(task => 
            shouldUpdateTask(task, taskId, fromOrder, toOrder)
        );

        const updatePromises = tasksToUpdate.map(task => {
            const newOrder = calculateNewOrder(task, taskId, fromOrder, toOrder);
            
            if (newOrder === undefined) {
                return Promise.resolve();
            }
            
            return new Promise<void>((resolve, reject) => {
                tasksHook.handleUpdateTask(
                    task.id,
                    { order: newOrder },
                    () => {
                        resolve();
                    },
                    (error) => {
                        console.error(`Failed to update task ${task.id}:`, error);
                        reject(new Error(error || `Failed to reorder task ${task.id}`));
                    }
                );
            });
        });

        await Promise.all(updatePromises);
    }, [tasksHook, calculateNewOrder, shouldUpdateTask]);

    const reorderTask = useCallback(async (
        taskId: string, 
        fromOrder: number, 
        toOrder: number, 
        columnId: number
    ) => {
        const previousTasks = [...tasks];
        
        try {
            setTasks(prevTasks => {
                const updatedTasks = updateUI(prevTasks, taskId, fromOrder, toOrder, columnId);
                return updatedTasks;
            });

            await updateDatabase(tasks, taskId, fromOrder, toOrder, columnId);
        } catch (error) {
            console.error('Failed to reorder task:', error);
            setTasks(previousTasks);
            onError(error instanceof Error ? error.message : 'Failed to reorder task');
        }
    }, [tasks, updateUI, updateDatabase, onSuccess, onError]);

    const deleteTask = useCallback(async (taskId: string) => {
        const originalTasks = [...tasks];
        
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

        tasksHook.handleDeleteTask(
            taskId,
            (response) => {
                const message = response?.message || 'Task deleted successfully';
                onSuccess(message);
            },
            (error) => {
                setTasks(originalTasks);
                onError(error || 'Failed to delete task');
            }
        );
    }, [tasks, tasksHook, onError, onSuccess]);

    const addTask = useCallback(async (taskData: any) => {
        return new Promise<void>((resolve, reject) => {
            tasksHook.handleAddTask(
                taskData,
                (newTaskData) => {
                    const taskData = newTaskData.data || newTaskData;
                    const transformedTask: Task = {
                        id: taskData.id.toString(),
                        title: taskData.title,
                        description: taskData.description || '',
                        columnId: taskData.column_id,
                        order: taskData.order || 1
                    };
                    
                    setTasks(prevTasks => [...prevTasks, transformedTask]);
                    onSuccess('Task created successfully');
                    resolve();
                },
                (error) => {
                    onError(error || 'Failed to create task');
                    reject(new Error(error));
                }
            );
        });
    }, [tasksHook, onSuccess, onError]);

    return {
        tasks,
        setTasks,
        updateTask,
        moveTask,
        reorderTask,
        deleteTask,
        addTask,
    };
}
