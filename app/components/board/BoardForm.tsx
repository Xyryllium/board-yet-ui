import React, { useState } from "react";

interface BoardFormProps {
    onCreate?: (boardName: string) => void;
    isLoading?: boolean;
}
export function BoardForm({onCreate, isLoading = false}: BoardFormProps){
    const [boardName, setBoardName] = useState("");
    const [boardDescription, setBoardDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(onCreate && boardName.trim()) {
            onCreate(boardName.trim());
            setBoardName("");
            setBoardDescription("");
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create New Board</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start organizing your projects with a new board</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Board Name *
                    </label>
                    <input
                        type="text"
                        id="boardName"
                        value={boardName}
                        disabled={isLoading}
                        onChange={(e) => setBoardName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        placeholder="e.g., Sprint Planning, Project Alpha"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="boardDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        id="boardDescription"
                        value={boardDescription}
                        disabled={isLoading}
                        onChange={(e) => setBoardDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 resize-none"
                        placeholder="Brief description of what this board is for..."
                        rows={3}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isLoading || !boardName.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Board...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Board
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}