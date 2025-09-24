import { useState, useRef, useCallback } from 'react';
import { createBoard, fetchBoard, fetchBoards } from '~/lib/board';
import type { Board } from '~/api/types';

interface UseBoardsState {
  boards: Board[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

interface UseBoardsActions {
  fetchAllBoards: () => Promise<void>;
  fetchSpecificBoard: (boardId: number, silent?: boolean) => Promise<void>;
  createNewBoard: (boardName: string) => Promise<{ success: boolean; board?: Board; error?: string }>;
  updateBoard: (boardId: number, updates: Partial<Board>) => void;
  clearError: () => void;
  setError: (error: string | null) => void;
  setHasFetched: (value: boolean) => void;
}

export function useBoards(): UseBoardsState & UseBoardsActions & { hasFetched: boolean } {
  const [state, setState] = useState<UseBoardsState>({
    boards: [],
    isLoading: false,
    isCreating: false,
    error: null,
  });
  
  const hasFetchedRef = useRef(false);

  const normalizeBoardsData = useCallback((data: any): Board[] => {
    return Array.isArray(data) ? data : [data];
  }, []);

  const handleApiError = useCallback((error: any, fallbackMessage: string): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return fallbackMessage;
  }, []);

  const updateState = useCallback((updates: Partial<UseBoardsState> | ((prev: UseBoardsState) => UseBoardsState)) => {
    setState(prev => {
      if (typeof updates === 'function') {
        return updates(prev);
      }
      return { ...prev, ...updates };
    });
  }, []);

  const fetchAllBoards = useCallback(async () => {
    updateState({ isLoading: true, error: null });
    
    try {
      const response = await fetchBoards();
      
      if (response.success && response.data) {
        const boardsArray = normalizeBoardsData(response.data);
        updateState({ 
          boards: boardsArray, 
          isLoading: false
        });
        hasFetchedRef.current = true;
      } else {
        const errorMessage = response.error || 'Failed to fetch boards';
        updateState({ 
          error: errorMessage, 
          isLoading: false
        });
        hasFetchedRef.current = true;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'An error occurred while fetching boards');
      updateState({ 
        error: errorMessage, 
        isLoading: false
      });
      hasFetchedRef.current = true;
    }
  }, [updateState, normalizeBoardsData, handleApiError]);

  const fetchSpecificBoard = useCallback(async (boardId: number, silent: boolean = false) => {
    if (!silent) {
      updateState({ isLoading: true, error: null });
    }
    
    try {
      const response = await fetchBoard(boardId);
      
      if (response.success && response.data) {
        const boardsArray = normalizeBoardsData(response.data);
        updateState({ 
          boards: boardsArray, 
          isLoading: false
        });
        hasFetchedRef.current = true;
      } else {
        const errorMessage = response.error || 'Failed to fetch board';
        if (!silent) {
          updateState({ 
            error: errorMessage, 
            isLoading: false
          });
        }
        hasFetchedRef.current = true;
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'An error occurred while fetching board');
      if (!silent) {
        updateState({ 
          error: errorMessage, 
          isLoading: false
        });
      }
      hasFetchedRef.current = true;
    }
  }, [updateState, normalizeBoardsData, handleApiError]); 

  const createNewBoard = useCallback(async (boardName: string) => {
    updateState({ isCreating: true, error: null });
    
    try {
      const response = await createBoard({ name: boardName });

      if (response.success && response.data) {
        const newBoard = Array.isArray(response.data) ? response.data[0] : response.data;
        updateState(prev => ({ 
          ...prev,
          boards: [...prev.boards, newBoard],
          isCreating: false 
        }));
        return { success: true, board: newBoard };
      } else {
        const errorMessage = response.error || 'Failed to create board';
        updateState({ 
          error: errorMessage, 
          isCreating: false 
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'An error occurred while creating the board');
      updateState({ 
        error: errorMessage, 
        isCreating: false 
      });
      return { success: false, error: errorMessage };
    }
  }, [updateState, handleApiError]);

  const updateBoard = useCallback((boardId: number, updates: Partial<Board>) => {
    updateState(prev => ({
      ...prev,
      boards: prev.boards.map((board: Board) => 
        board.id === boardId ? { ...board, ...updates } : board
      )
    }));
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const setError = useCallback((error: string | null) => {
    updateState({ error });
  }, [updateState]);

  const setHasFetched = useCallback((value: boolean) => {
    hasFetchedRef.current = value;
  }, []);

  return {
    // State
    ...state,
    hasFetched: hasFetchedRef.current,
    
    // Actions
    fetchAllBoards,
    fetchSpecificBoard,
    createNewBoard,
    updateBoard,
    clearError,
    setError,
    setHasFetched,
  };
}
