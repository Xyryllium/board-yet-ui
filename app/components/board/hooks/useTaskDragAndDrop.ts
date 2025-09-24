import { useState, useCallback } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  columnId: number;
  order?: number;
}

interface UseTaskDragAndDropProps {
  onTaskMove: (taskId: string, fromColumnId: number, toColumnId: number) => void;
  onTaskReorder?: (taskId: string, fromOrder: number, toOrder: number, columnId: number) => void;
}

export function useTaskDragAndDrop({ onTaskMove, onTaskReorder }: UseTaskDragAndDropProps) {
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; columnId: number } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);

  const handleDragStart = useCallback((taskId: string, columnId: number) => {
    setDraggedTask({ taskId, columnId });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, columnId: number, targetOrder?: number) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const { taskId, columnId: fromColumnId } = draggedTask;
    
    if (fromColumnId !== columnId) {
      onTaskMove(taskId, fromColumnId, columnId);
    } else if (onTaskReorder && targetOrder !== undefined) {
      const fromOrder = parseInt(e.dataTransfer.getData('text/order') || '1');
      onTaskReorder(taskId, fromOrder, targetOrder, columnId);
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  }, [draggedTask, onTaskMove, onTaskReorder]);

  const isTaskBeingDragged = useCallback((taskId: string) => {
    return draggedTask?.taskId === taskId;
  }, [draggedTask]);

  const isColumnBeingDraggedOver = useCallback((columnId: number) => {
    return dragOverColumn === columnId;
  }, [dragOverColumn]);

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isTaskBeingDragged,
    isColumnBeingDraggedOver,
    draggedTask
  };
}
