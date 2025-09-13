import React, { useEffect, useState } from "react";
import { ColumnInput } from "./ColumnInput";
import { DraggableColumnList } from "./DraggableColumnList";
import { ModalActions } from "./ModalActions";
import { useColumnManagement } from "./hooks/useColumnManagement";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

interface Column {
  id: number;
  name: string;
  order: number;
}

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumns: (columns: Column[]) => void;
  onUpdateColumn?: (columnId: number, name: string, order: number) => void;
  onDeleteColumn?: (columnId: number) => void;
  onReorderColumns?: (columns: Column[]) => void;
  existingColumns?: Column[];
  isLoading?: boolean;
}

export function AddColumnModal({ 
  isOpen, 
  onClose, 
  onAddColumns, 
  onUpdateColumn, 
  onDeleteColumn, 
  onReorderColumns,
  existingColumns = [], 
  isLoading = false 
}: AddColumnModalProps) {
  const {
    columnName,
    setColumnName,
    newColumns,
    addColumn,
    removeColumn,
    updateColumns,
    reset
  } = useColumnManagement(existingColumns);

  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [localExistingColumns, setLocalExistingColumns] = useState<Column[]>(existingColumns);

  useEffect(() => {
    setLocalExistingColumns(existingColumns);
  }, [existingColumns]);

  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleRemoveColumn
  } = useDragAndDrop(existingColumns);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumns.length > 0) {
      onAddColumns(newColumns);
      reset();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDropWithUpdate = (e: React.DragEvent, dropIndex: number) => {
    handleDrop(e, dropIndex, newColumns, updateColumns);
  };

  const handleRemoveWithUpdate = (index: number) => {
    handleRemoveColumn(index, newColumns, updateColumns);
  };

  const handleEditExisting = (column: Column) => {
    setEditingColumnId(column.id);
    setEditingName(column.name);
  };

  const handleSaveEdit = () => {
    if (editingColumnId && editingName.trim() && onUpdateColumn) {
      const column = localExistingColumns.find(c => c.id === editingColumnId);
      if (column) {
        onUpdateColumn(editingColumnId, editingName.trim(), column.order);
        setLocalExistingColumns(prev => 
          prev.map(c => c.id === editingColumnId ? { ...c, name: editingName.trim() } : c)
        );
      }
    }
    setEditingColumnId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingColumnId(null);
    setEditingName("");
  };

  const handleDeleteExisting = (columnId: number) => {
    if (onDeleteColumn) {
      onDeleteColumn(columnId);
      setLocalExistingColumns(prev => prev.filter(c => c.id !== columnId));
    }
  };

  const handleReorderExisting = (e: React.DragEvent, dropIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newColumns = [...localExistingColumns];
      const draggedColumn = newColumns[draggedIndex];
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(dropIndex, 0, draggedColumn);
      
      const reorderedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index
      }));
      
      setLocalExistingColumns(reorderedColumns);
      if (onReorderColumns) {
        onReorderColumns(reorderedColumns);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="modal-backdrop"
          onClick={handleClose}
          aria-hidden="true"
        ></div>

        <div 
          className="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-card px-6 py-6">
            <div className="flex-between mb-6">
              <h3 id="modal-title" className="text-xl font-bold text-primary">
                Add Columns
              </h3>
              <button
                onClick={handleClose}
                className="btn-icon btn-icon-gray"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-vertical-lg">
              <ColumnInput
                columnName={columnName}
                setColumnName={setColumnName}
                onAddColumn={addColumn}
                isLoading={isLoading}
              />

              {localExistingColumns.length > 0 ? (
                <div className="space-vertical-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Existing Columns (drag to reorder, click to edit)
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {localExistingColumns.map((column, index) => (
                      <div
                        key={column.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleReorderExisting(e, index)}
                        className={`column-item ${
                          draggedIndex === index ? 'column-item-dragging' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 text-blue-500 dark:text-blue-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                        <div className="flex-1 flex-start space-x-2">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {column.order + 1}.
                          </span>
                          {editingColumnId === column.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              className="flex-1 px-2 py-1 text-sm border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <span 
                              className="text-blue-900 dark:text-blue-100 font-medium cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 px-2 py-1 rounded"
                              onClick={() => handleEditExisting(column)}
                            >
                              {column.name}
                            </span>
                          )}
                        </div>
                        <div className="flex-start space-x-2">
                          {editingColumnId === column.id ? (
                            <>
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="btn-icon btn-icon-green"
                                title="Save"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-icon btn-icon-gray"
                                title="Cancel"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditExisting(column)}
                                className="btn-icon btn-icon-blue"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExisting(column.id)}
                                className="btn-icon btn-icon-red"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-vertical-sm">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Existing Columns
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center-content text-muted-secondary">
                    No existing columns found for this board.
                  </div>
                </div>
              )}

              {newColumns.length > 0 && (
                <DraggableColumnList
                  columns={newColumns}
                  existingColumnsCount={existingColumns.length}
                  draggedIndex={draggedIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDropWithUpdate}
                  onRemoveColumn={handleRemoveWithUpdate}
                />
              )}

              <ModalActions
                onClose={handleClose}
                onSubmit={(e) => handleSubmit(e)}
                isLoading={isLoading}
                hasColumns={newColumns.length > 0}
                columnCount={newColumns.length}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}