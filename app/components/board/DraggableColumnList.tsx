import React from 'react';

interface Column {
  id: number;
  name: string;
  order: number;
}

interface DraggableColumnListProps {
  columns: Column[];
  existingColumnsCount: number;
  draggedIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onRemoveColumn: (index: number) => void;
}

export function DraggableColumnList({
  columns,
  existingColumnsCount,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onRemoveColumn
}: DraggableColumnListProps) {
  if (columns.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        New Columns (drag to reorder)
        {existingColumnsCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            (Will be added after {existingColumnsCount} existing columns)
          </span>
        )}
      </label>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {columns.map((column, index) => (
          <div
            key={column.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className={`flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg cursor-move hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {column.order + 1}.
              </span>
              <span className="text-green-900 dark:text-green-100 font-medium">
                {column.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                New
              </span>
              <button
                type="button"
                onClick={() => onRemoveColumn(index)}
                className="flex-shrink-0 text-green-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
