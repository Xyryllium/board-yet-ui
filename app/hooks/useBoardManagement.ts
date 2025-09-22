import { useBoards } from './useBoards';
import { useColumns } from './useColumns';
import { usePagination } from './usePagination';
import type { Board } from '~/api/types';

const ITEMS_PER_PAGE = 4;

export function useBoardManagement() {
  const boardsHook = useBoards();
  const columnsHook = useColumns();
  const pagination = usePagination({ 
    items: boardsHook.boards, 
    itemsPerPage: ITEMS_PER_PAGE 
  });

  const handleCreateBoard = async (boardName: string) => {
    const result = await boardsHook.createNewBoard(boardName);
    if (result.success) {
      pagination.resetToFirstPage();
    }
    return result;
  };

  const handleAddColumns = async (boardId: number, columns: any[]) => {
    await columnsHook.handleAddColumns(
      boardId,
      columns,
      (newColumns) => {
        boardsHook.updateBoard(boardId, {
          columns: [...boardsHook.boards.find(b => b.id === boardId)?.columns || [], ...newColumns]
        });
      },
      (error) => {
        boardsHook.clearError();
        // Set error through boards hook
        (boardsHook as any).setError(error);
      }
    );
  };

  const handleUpdateColumn = async (boardId: number, columnId: number, name: string, order: number) => {
    await columnsHook.handleUpdateColumn(
      boardId,
      columnId,
      name,
      order,
      () => {
        boardsHook.updateBoard(boardId, {
          columns: boardsHook.boards
            .find(b => b.id === boardId)
            ?.columns.map(col => 
              col.id === columnId ? { ...col, name, order } : col
            ) || []
        });
      },
      (error) => {
        boardsHook.clearError();
        (boardsHook as any).setError(error);
      }
    );
  };

  const handleDeleteColumn = async (boardId: number, columnId: number) => {
    await columnsHook.handleDeleteColumn(
      boardId,
      columnId,
      () => {
        boardsHook.updateBoard(boardId, {
          columns: boardsHook.boards
            .find(b => b.id === boardId)
            ?.columns.filter(col => col.id !== columnId) || []
        });
      },
      (error) => {
        boardsHook.clearError();
        (boardsHook as any).setError(error);
      }
    );
  };

  const handleReorderColumns = async (boardId: number, columns: any[]) => {
    await columnsHook.handleReorderColumns(
      boardId,
      columns,
      (reorderedColumns) => {
        boardsHook.updateBoard(boardId, {
          columns: reorderedColumns
        });
      },
      (error) => {
        boardsHook.clearError();
        (boardsHook as any).setError(error);
      }
    );
  };

  return {
    // Board state
    boards: boardsHook.boards,
    isLoading: boardsHook.isLoading,
    isCreating: boardsHook.isCreating,
    error: boardsHook.error,
    hasFetched: boardsHook.hasFetched,
    
    // Pagination
    paginatedBoards: pagination.paginatedItems,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalBoards: pagination.totalItems,
    
    // Actions
    fetchAllBoards: boardsHook.fetchAllBoards,
    setHasFetched: boardsHook.setHasFetched,
    handleCreateBoard,
    handleAddColumns,
    handleUpdateColumn,
    handleDeleteColumn,
    handleReorderColumns,
    handlePageChange: pagination.handlePageChange,
    clearError: boardsHook.clearError
  };
}
