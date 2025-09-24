export const TASK_STYLES = {
  container: (isDragging: boolean) => 
    `bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-move group ${
      isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
    }`,
  indicator: "w-4 h-4 bg-blue-500 rounded-full mt-1 flex-shrink-0",
  content: "flex-1 min-w-0",
} as const;

export const DRAG_CONFIG = {
  effectAllowed: 'move' as const,
  dataFormat: 'text/plain',
} as const;
