import { useCallback } from 'react';
import { useColumns } from '~/hooks/useColumns';
import { useBoards } from '~/hooks/useBoards';
import type { Column } from '~/components/board/types';

interface UseColumnManagementProps {
    boardId: number;
    board: any;
    onError: (error: string) => void;
}

export function useBoardColumnManagement({ boardId, board, onError }: UseColumnManagementProps) {
    const columnsHook = useColumns();
    const boardsHook = useBoards();

    const addColumns = useCallback(async (newColumns: Column[]) => {
        await columnsHook.handleAddColumns(
            boardId,
            newColumns,
            (newColumnsData) => {
                boardsHook.updateBoard(boardId, {
                    columns: [...(board?.columns || []), ...newColumnsData]
                });
            },
            (error) => {
                boardsHook.clearError();
                (boardsHook as any).setError(error);
                onError(error || 'Failed to add columns');
            }
        );
    }, [boardId, board, columnsHook, boardsHook, onError]);

    const updateColumn = useCallback(async (columnId: number, name: string, order?: number) => {
        const columnOrder = order ?? 0;
        await columnsHook.handleUpdateColumn(
            boardId,
            columnId,
            name,
            columnOrder,
            () => {
                boardsHook.updateBoard(boardId, {
                    columns: (board?.columns || []).map((col: any) => 
                        col.id === columnId ? { ...col, name, order: columnOrder } : col
                    )
                });
            },
            (error) => {
                boardsHook.clearError();
                (boardsHook as any).setError(error);
                onError(error || 'Failed to update column');
            }
        );
    }, [boardId, board, columnsHook, boardsHook, onError]);

    const deleteColumn = useCallback(async (columnId: number) => {
        await columnsHook.handleDeleteColumn(
            boardId,
            columnId,
            () => {
                boardsHook.updateBoard(boardId, {
                    columns: (board?.columns || []).filter((col: any) => col.id !== columnId)
                });
            },
            (error) => {
                boardsHook.clearError();
                (boardsHook as any).setError(error);
                onError(error || 'Failed to delete column');
            }
        );
    }, [boardId, board, columnsHook, boardsHook, onError]);

    const reorderColumns = useCallback(async (reorderedColumns: Column[]) => {
        const columnsWithOrder = reorderedColumns.map((col, index) => ({
            ...col,
            order: col.order ?? index
        }));
        
        await columnsHook.handleReorderColumns(
            boardId,
            columnsWithOrder,
            (reorderedColumnsData) => {
                boardsHook.updateBoard(boardId, {
                    columns: reorderedColumnsData
                });
            },
            (error) => {
                boardsHook.clearError();
                (boardsHook as any).setError(error);
                onError(error || 'Failed to reorder columns');
            }
        );
    }, [boardId, columnsHook, boardsHook, onError]);

    return {
        addColumns,
        updateColumn,
        deleteColumn,
        reorderColumns,
    };
}
