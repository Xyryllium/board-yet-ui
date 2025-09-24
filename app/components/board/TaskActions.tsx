import React from 'react';

interface TaskActionsProps {
  onDelete?: (taskId: string) => void;
  taskId: string;
}

const DELETE_ICON = (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </svg>
);

export function TaskActions({ onDelete, taskId }: TaskActionsProps) {
  if (!onDelete) return null;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(taskId);
  };

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Delete task"
        >
          {DELETE_ICON}
        </button>
      </div>
    </div>
  );
}
