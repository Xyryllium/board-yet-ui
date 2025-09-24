import { useState, useEffect, useCallback } from 'react';

interface UseInlineEditingProps {
  initialValue: string;
  onSave: (value: string) => void;
  isDisabled?: boolean;
}

export function useInlineEditing({ 
  initialValue, 
  onSave, 
  isDisabled = false 
}: UseInlineEditingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialValue);

  useEffect(() => {
    setEditValue(initialValue);
  }, [initialValue]);

  const startEdit = useCallback(() => {
    if (!isDisabled) {
      setIsEditing(true);
      setEditValue(initialValue);
    }
  }, [isDisabled, initialValue]);

  const handleValueChange = useCallback((value: string) => {
    setEditValue(value);
  }, []);

  const save = useCallback(() => {
    const trimmedValue = editValue.trim();
    if (trimmedValue !== initialValue) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  }, [editValue, initialValue, onSave]);

  const cancel = useCallback(() => {
    setEditValue(initialValue);
    setIsEditing(false);
  }, [initialValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }, [save, cancel]);

  const handleBlur = useCallback(() => {
    save();
  }, [save]);

  return {
    isEditing,
    editValue,
    startEdit,
    handleValueChange,
    save,
    cancel,
    handleKeyDown,
    handleBlur,
  };
}
