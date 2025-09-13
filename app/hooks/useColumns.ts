import { createColumn, updateColumn, deleteColumn, reorderColumns } from '~/lib/column';

export function useColumns() {
  const handleAddColumns = async (boardId: number, columns: any[], onSuccess: (newColumns: any[]) => void, onError: (error: string) => void) => {
    try {
      const response = await createColumn({ boardId, columns });
      
      if (response.success && response.data) {
        const newColumns = Array.isArray(response.data) 
          ? response.data 
          : [response.data];
        onSuccess(newColumns);
      } else {
        onError(response.error || 'Failed to add columns');
      }
    } catch (error) {
      onError('An error occurred while adding columns');
    }
  };

  const handleUpdateColumn = async (
    boardId: number, 
    columnId: number, 
    name: string, 
    order: number, 
    onSuccess: () => void, 
    onError: (error: string) => void
  ) => {
    try {
      const response = await updateColumn(columnId, boardId, { name, order });
      
      if (response.success && response.data) {
        onSuccess();
      } else {
        onError(response.error || 'Failed to update column');
      }
    } catch (error) {
      onError('An error occurred while updating column');
    }
  };

  const handleDeleteColumn = async (
    boardId: number, 
    columnId: number, 
    onSuccess: () => void, 
    onError: (error: string) => void
  ) => {
    try {
      const response = await deleteColumn(columnId);
      
      if (response.success) {
        onSuccess();
      } else {
        onError(response.error || 'Failed to delete column');
      }
    } catch (error) {
      onError('An error occurred while deleting column');
    }
  };

  const handleReorderColumns = async (
    boardId: number, 
    columns: any[], 
    onSuccess: (reorderedColumns: any[]) => void, 
    onError: (error: string) => void
  ) => {
    try {
      const reorderData = {
        boardId,
        columns: columns.map((col, index) => ({
          id: col.id,
          order: index
        }))
      };
      
      const response = await reorderColumns(reorderData);
      
      if (response.success && response.data) {
        onSuccess(response.data as any[]);
      } else {
        onError(response.error || 'Failed to reorder columns');
      }
    } catch (error) {
      onError('An error occurred while reordering columns');
    }
  };

  return {
    handleAddColumns,
    handleUpdateColumn,
    handleDeleteColumn,
    handleReorderColumns
  };
}
