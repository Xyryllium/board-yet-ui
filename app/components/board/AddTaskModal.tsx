import React from 'react';
import type { CreateTaskData } from '~/api/types';
import { AddTaskForm } from './AddTaskForm';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: CreateTaskData) => void;
  columnId: number;
  columnName: string;
  isLoading?: boolean;
  existingTasks?: Array<{ order?: number }>;
}

export function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  columnId,
  columnName,
  isLoading = false,
  existingTasks = []
}: AddTaskModalProps) {
  if (!isOpen) return null;

  const handleAddTask = (taskData: CreateTaskData) => {
    onAddTask(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Task
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Add a task to <span className="font-medium text-blue-600 dark:text-blue-400">{columnName}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <AddTaskForm
              columnId={columnId}
              onSubmit={handleAddTask}
              onCancel={onClose}
              isLoading={isLoading}
              existingTasks={existingTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
