import { useCallback } from 'react';
import { useBoards } from './useBoards';
import { useColumns } from './useColumns';
import { usePagination } from './usePagination';
import type { Board } from '~/api/types';
import type { Column } from '~/components/board/types';

const ITEMS_PER_PAGE = 4;

interface UseBoardManagementState {
  boards: Board[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  hasFetched: boolean;
  paginatedBoards: Board[];
  currentPage: number;
  totalPages: number;
  totalBoards: number;
}

interface UseBoardManagementActions {
  fetchAllBoards: () => Promise<void>;
  setHasFetched: (value: boolean) => void;
  handleCreateBoard: (boardName: string) => Promise<{ success: boolean; board?: Board; error?: string }>;
  handleAddColumns: (boardId: number, columns: Column[]) => Promise<void>;
  handleUpdateColumn: (boardId: number, columnId: number, name: string, order: number) => Promise<void>;
  handleDeleteColumn: (boardId: number, columnId: number) => Promise<void>;
  handleReorderColumns: (boardId: number, columns: Column[]) => Promise<void>;
  handlePageChange: (page: number) => void;
  clearError: () => void;
}

export function useBoardManagement(): UseBoardManagementState & UseBoardManagementActions {
  const boardsHook = useBoards();
  const columnsHook = useColumns();
  const pagination = usePagination({ 
    items: boardsHook.boards, 
    itemsPerPage: ITEMS_PER_PAGE 
  });

  const handleColumnError = useCallback((error: string) => {
    boardsHook.clearError();
    boardsHook.setError(error);
  }, [boardsHook]);

  const getBoardById = useCallback((boardId: number): Board | undefined => {
    return boardsHook.boards.find(board => board.id === boardId);
  }, [boardsHook.boards]);

  const handleCreateBoard = useCallback(async (boardName: string) => {
    const result = await boardsHook.createNewBoard(boardName);
    if (result.success) {
      pagination.resetToFirstPage();
    }
    return result;
  }, [boardsHook, pagination]);

  const handleAddColumns = useCallback(async (boardId: number, columns: Column[]) => {
    const board = getBoardById(boardId);
    if (!board) {
      handleColumnError('Board not found');
      return;
    }

    await columnsHook.handleAddColumns(
      boardId,
      columns,
      (newColumns) => {
        boardsHook.updateBoard(boardId, {
          columns: [...(board.columns || []), ...newColumns]
        });
      },
      handleColumnError
    );
  }, [columnsHook, getBoardById, boardsHook, handleColumnError]);

  const handleUpdateColumn = useCallback(async (boardId: number, columnId: number, name: string, order: number) => {
    const board = getBoardById(boardId);
    if (!board) {
      handleColumnError('Board not found');
      return;
    }

    await columnsHook.handleUpdateColumn(
      boardId,
      columnId,
      name,
      order,
      () => {
        boardsHook.updateBoard(boardId, {
          columns: (board.columns || []).map((col: Column) => 
            col.id === columnId ? { ...col, name, order } : col
          )
        });
      },
      handleColumnError
    );
  }, [columnsHook, getBoardById, boardsHook, handleColumnError]);

  const handleDeleteColumn = useCallback(async (boardId: number, columnId: number) => {
    const board = getBoardById(boardId);
    if (!board) {
      handleColumnError('Board not found');
      return;
    }

    await columnsHook.handleDeleteColumn(
      boardId,
      columnId,
      () => {
        boardsHook.updateBoard(boardId, {
          columns: (board.columns || []).filter((col: Column) => col.id !== columnId)
        });
      },
      handleColumnError
    );
  }, [columnsHook, getBoardById, boardsHook, handleColumnError]);

  const handleReorderColumns = useCallback(async (boardId: number, columns: Column[]) => {
    const board = getBoardById(boardId);
    if (!board) {
      handleColumnError('Board not found');
      return;
    }

    await columnsHook.handleReorderColumns(
      boardId,
      columns,
      (reorderedColumns) => {
        boardsHook.updateBoard(boardId, {
          columns: reorderedColumns
        });
      },
      handleColumnError
    );
  }, [columnsHook, getBoardById, boardsHook, handleColumnError]);

  return {
    // Board state
    boards: boardsHook.boards,
    isLoading: boardsHook.isLoading,
    isCreating: boardsHook.isCreating,
    error: boardsHook.error,
    hasFetched: boardsHook.hasFetched,
    
    // Pagination state
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
    clearError: boardsHook.clearError,
  };
}
