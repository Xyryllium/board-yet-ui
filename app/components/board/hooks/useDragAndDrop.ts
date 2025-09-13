import { useState } from 'react';

interface Column {
  id: number;
  name: string;
  order: number;
}

export function useDragAndDrop(existingColumns: Column[]) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    e: React.DragEvent, 
    dropIndex: number, 
    columns: Column[], 
    setColumns: (columns: Column[]) => void
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const draggedColumn = columns[draggedIndex];
    const updatedColumns = [...columns];
    updatedColumns.splice(draggedIndex, 1);
    updatedColumns.splice(dropIndex, 0, draggedColumn);

    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: existingColumns.length + index
    }));

    setColumns(reorderedColumns);
    setDraggedIndex(null);
  };

  const handleRemoveColumn = (
    index: number, 
    columns: Column[], 
    setColumns: (columns: Column[]) => void
  ) => {
    const updatedColumns = columns.filter((_, i) => i !== index).map((col, i) => ({ 
      ...col, 
      order: existingColumns.length + i 
    }));
    setColumns(updatedColumns);
  };

  return {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleRemoveColumn
  };
}
