import React from 'react';
import { useInlineEditing } from './hooks/useInlineEditing';

interface TaskTitleProps {
  title: string;
  onUpdate: (newTitle: string) => void;
  isDragging: boolean;
}

const TITLE_STYLES = {
  display: "text-sm font-medium text-gray-900 dark:text-white mb-1 truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 py-0.5 transition-colors",
  input: "text-sm font-medium text-gray-900 dark:text-white mb-1 w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5"
} as const;

export function TaskTitle({ title, onUpdate, isDragging }: TaskTitleProps) {
  const {
    isEditing,
    editValue,
    startEdit,
    handleValueChange,
    handleKeyDown,
    handleBlur,
  } = useInlineEditing({
    initialValue: title,
    onSave: onUpdate,
    isDisabled: isDragging,
  });

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={TITLE_STYLES.input}
        autoFocus
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <h4 
      className={TITLE_STYLES.display}
      onClick={startEdit}
    >
      {title}
    </h4>
  );
}
