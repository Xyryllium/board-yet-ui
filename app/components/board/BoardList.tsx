import type { Board } from "~/api/types";
import { Pagination } from "~/components/ui";
import { AddColumnModal } from "./AddColumnModal";
import { useState } from "react";
import { Link } from "react-router";

interface Column {
    id: number;
    name: string;
    order: number;
}

interface BoardProps {
    boards: Board[];
    allBoards: Board[];
    totalBoards: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onAddColumns?: (boardId: number, columns: Column[]) => void;
    onUpdateColumn?: (boardId: number, columnId: number, name: string, order: number) => void;
    onDeleteColumn?: (boardId: number, columnId: number) => void;
    onReorderColumns?: (boardId: number, columns: Column[]) => void;
    isAdmin?: boolean;
}

export function BoardList({boards, allBoards, totalBoards, currentPage, totalPages, onPageChange, onAddColumns, onUpdateColumn, onDeleteColumn, onReorderColumns, isAdmin = false}: BoardProps) {
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddColumnClick = (boardId: number) => {
        setSelectedBoardId(boardId);
        setIsModalOpen(true);
    };

    const handleAddColumns = (columns: Column[]) => {
        if (selectedBoardId && onAddColumns) {
            onAddColumns(selectedBoardId, columns);
        }
        setIsModalOpen(false);
        setSelectedBoardId(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBoardId(null);
    };

    const handleUpdateColumn = (columnId: number, name: string, order: number) => {
        if (selectedBoardId && onUpdateColumn) {
            onUpdateColumn(selectedBoardId, columnId, name, order);
        }
    };

    const handleDeleteColumn = (columnId: number) => {
        if (selectedBoardId && onDeleteColumn) {
            onDeleteColumn(selectedBoardId, columnId);
        }
    };

    const handleReorderColumns = (columns: Column[]) => {
        if (selectedBoardId && onReorderColumns) {
            onReorderColumns(selectedBoardId, columns);
        }
    };
    return (
        <div className="card">
            <div className="flex-between mb-6">
                <h2 className="heading-4">My Boards</h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                    {totalBoards} {totalBoards === 1 ? 'board' : 'boards'}
                </span>
            </div>
        
            <div className="space-y-3">
                {boards.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">No boards yet</p>
                        <p className="text-sm">Create your first board to get started</p>
                    </div>
                ) : (
                    boards.map((board) => (
                        <div key={board.id} className="group relative">
                            <Link 
                                to={`/tenant/board/${board.id}`}
                                className="block"
                            >
                                <div className="board-card">
                                    <div className="board-avatar">
                                        {board.name ? board.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-primary text-lg truncate">
                                            {board.name || 'Unnamed Board'}
                                        </h3>
                                        {board.description ? (
                                            <p className="text-sm text-muted-secondary truncate mt-1">{board.description}</p>
                                        ) : (
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No description</p>
                                        )}
                                        <div className="flex-start space-x-4 mt-2">
                                            <span className="text-xs text-muted-secondary">
                                                {new Date(board.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-muted-secondary">
                                                {board.columns.length} columns
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            {isAdmin && (
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddColumnClick(board.id);
                                        }}
                                        className="btn-icon btn-icon-blue"
                                        title="Add Column"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className="btn-icon btn-icon-gray"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalBoards}
                itemsPerPage={4}
                onPageChange={onPageChange}
                showInfo={true}
            />

            <AddColumnModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddColumns={handleAddColumns}
                onUpdateColumn={handleUpdateColumn}
                onDeleteColumn={handleDeleteColumn}
                onReorderColumns={handleReorderColumns}
                existingColumns={selectedBoardId ? allBoards.find(b => b.id === selectedBoardId)?.columns.map((col, index) => ({
                    id: col.id,
                    name: col.name,
                    order: index
                })) || [] : []}
            />
        </div>
    );
}