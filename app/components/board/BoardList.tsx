import type { Board } from "~/api/types";
import { Pagination } from "~/components/ui";

interface BoardProps {
    boards: Board[];
    totalBoards: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function BoardList({boards, totalBoards, currentPage, totalPages, onPageChange}: BoardProps) {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Boards</h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                    {totalBoards} {totalBoards === 1 ? 'board' : 'boards'}
                </span>
            </div>
        
            <div className="space-y-3">
                {boards.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">No boards yet</p>
                        <p className="text-sm">Create your first board to get started</p>
                    </div>
                ) : (
                    boards.map((board) => (
                        <div key={board.id} className="group flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {board.name ? board.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                                    {board.name || 'Unnamed Board'}
                                </h3>
                                {board.description ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{board.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No description</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {new Date(board.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {board.columns.length} columns
                                    </span>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
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
        </div>
    );
}