import React from 'react';
import { useInlineEditing } from './hooks/useInlineEditing';

interface TaskDescriptionProps {
  description?: string;
  onUpdate: (newDescription: string) => void;
  isDragging: boolean;
}

const DESCRIPTION_STYLES = {
  display: "text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 py-0.5 transition-colors min-h-[1.5rem]",
  textarea: "text-xs text-gray-500 dark:text-gray-400 mb-2 w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 resize-none min-h-[2rem] max-h-20",
  placeholder: "text-gray-400 dark:text-gray-500 italic"
} as const;

export function TaskDescription({ description, onUpdate, isDragging }: TaskDescriptionProps) {
  const {
    isEditing,
    editValue,
    startEdit,
    handleValueChange,
    handleKeyDown,
    handleBlur,
  } = useInlineEditing({
    initialValue: description || '',
    onSave: onUpdate,
    isDisabled: isDragging,
  });

  if (isEditing) {
    return (
      <textarea
        value={editValue}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={DESCRIPTION_STYLES.textarea}
        placeholder="Add a description..."
        autoFocus
        onClick={(e) => e.stopPropagation()}
        rows={2}
      />
    );
  }

  return (
    <div 
      className={DESCRIPTION_STYLES.display}
      onClick={startEdit}
    >
      {description || (
        <span className={DESCRIPTION_STYLES.placeholder}>
          Click to add description...
        </span>
      )}
    </div>
  );
}
