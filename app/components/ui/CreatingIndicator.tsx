interface CreatingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

export function CreatingIndicator({ isVisible, message = 'Adding board...' }: CreatingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
      </div>
    </div>
  );
}
