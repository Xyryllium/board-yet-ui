import type { Task } from '~/components/board/types';

export function transformBoardTasksToTasks(board: any): Task[] {
    const allTasks: Task[] = [];
    
    board.columns.forEach((column: any) => {
        if (column.cards && Array.isArray(column.cards)) {
            column.cards.forEach((card: any) => {
                allTasks.push({
                    id: card.id.toString(),
                    title: card.title || card.name || 'Untitled Card',
                    description: card.description || '',
                    columnId: column.id,
                    order: card.order || 1
                });
            });
        }
    });
    
    return allTasks.sort((a, b) => {
        if (a.columnId !== b.columnId) return 0;
        return (a.order || 1) - (b.order || 1);
    });
}

export function getTasksForColumn(tasks: Task[], columnId: number): Task[] {
    return tasks
        .filter(task => task.columnId === columnId)
        .sort((a, b) => (a.order || 1) - (b.order || 1));
}

export function createOptimisticTaskUpdate(
    tasks: Task[], 
    taskId: string, 
    updates: Partial<Task>
): Task[] {
    return tasks.map(task => 
        task.id === taskId 
            ? { ...task, ...updates }
            : task
    );
}

export function createOptimisticTaskMove(
    tasks: Task[], 
    taskId: string, 
    toColumnId: number
): Task[] {
    return tasks.map(task => 
        task.id === taskId 
            ? { ...task, columnId: toColumnId }
            : task
    );
}

function calculateNewOrder(
    task: Task,
    taskId: string,
    fromOrder: number,
    toOrder: number
): number | undefined {
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
}

export function createOptimisticTaskReorder(
    tasks: Task[], 
    taskId: string, 
    fromOrder: number, 
    toOrder: number, 
    columnId: number
): Task[] {
    const columnTasks = tasks.filter(task => task.columnId === columnId);
    const otherTasks = tasks.filter(task => task.columnId !== columnId);
    
    const reorderedTasks = columnTasks.map(task => {
        const newOrder = calculateNewOrder(task, taskId, fromOrder, toOrder);
        return newOrder !== undefined ? { ...task, order: newOrder } : task;
    });
    
    return [...otherTasks, ...reorderedTasks];
}
