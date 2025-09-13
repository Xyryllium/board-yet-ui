import React from 'react';

interface ColumnInputProps {
  columnName: string;
  setColumnName: (name: string) => void;
  onAddColumn: () => void;
  isLoading: boolean;
}

export function ColumnInput({ columnName, setColumnName, onAddColumn, isLoading }: ColumnInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddColumn();
    }
  };

  return (
    <div>
      <label htmlFor="columnName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Add New Column
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          id="columnName"
          value={columnName}
          disabled={isLoading}
          onChange={(e) => setColumnName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          placeholder="e.g., To Do, In Progress, Done"
          autoFocus
        />
        <button
          type="button"
          onClick={onAddColumn}
          disabled={!columnName.trim() || isLoading}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
