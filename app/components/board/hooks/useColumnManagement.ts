import { useState } from 'react';

interface Column {
  id: number;
  name: string;
  order: number;
}

export function useColumnManagement(existingColumns: Column[]) {
  const [columnName, setColumnName] = useState('');
  const [newColumns, setNewColumns] = useState<Column[]>([]);

  const generateNextId = () => {
    const maxExistingId = existingColumns.length > 0 ? Math.max(...existingColumns.map(col => col.id)) : 0;
    const maxNewId = newColumns.length > 0 ? Math.max(...newColumns.map(col => col.id)) : 0;
    return Math.max(maxExistingId, maxNewId) + 1;
  };

  const addColumn = () => {
    if (columnName.trim()) {
      const newColumn: Column = {
        id: generateNextId(),
        name: columnName.trim(),
        order: existingColumns.length + newColumns.length
      };
      setNewColumns(prev => [...prev, newColumn]);
      setColumnName('');
    }
  };

  const removeColumn = (index: number) => {
    setNewColumns(prev => prev.filter((_, i) => i !== index).map((col, i) => ({ 
      ...col, 
      order: existingColumns.length + i 
    })));
  };

  const updateColumns = (columns: Column[]) => {
    setNewColumns(columns);
  };

  const reset = () => {
    setColumnName('');
    setNewColumns([]);
  };

  return {
    columnName,
    setColumnName,
    newColumns,
    addColumn,
    removeColumn,
    updateColumns,
    reset
  };
}
