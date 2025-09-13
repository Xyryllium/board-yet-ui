import { useState, useRef } from 'react';
import { createBoard, fetchBoard } from '~/lib/board';
import type { Board } from '~/api/types';

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchBoards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchBoard();
      
      if (response.success && response.data) {
        const boardsArray = Array.isArray(response.data) ? response.data : [response.data];
        setBoards(boardsArray);
      } else {
        setError(response.error || 'Failed to fetch boards');
      }
    } catch (error) {
      setError('An error occurred while fetching boards');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewBoard = async (boardName: string) => {
    setIsCreating(true);
    setError(null);
    
    try {
      const response = await createBoard({ name: boardName });

      if(response.success && response.data) {
        const newBoard = Array.isArray(response.data) ? response.data[0] : response.data;
        setBoards(prevBoards => [...prevBoards, newBoard]);
        return { success: true, board: newBoard };
      } else {
        setError(response.error || 'Failed to create board');
        return { success: false, error: response.error };
      }
    } catch (error) {
      setError('An error occurred while creating the board');
      return { success: false, error: 'An error occurred while creating the board' };
    } finally {
      setIsCreating(false);
    }
  };

  const updateBoard = (boardId: number, updates: Partial<Board>) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === boardId ? { ...board, ...updates } : board
      )
    );
  };

  const clearError = () => setError(null);

  return {
    boards,
    isLoading,
    isCreating,
    error,
    hasFetched: hasFetched.current,
    setHasFetched: (value: boolean) => { hasFetched.current = value; },
    fetchBoards,
    createNewBoard,
    updateBoard,
    clearError
  };
}
