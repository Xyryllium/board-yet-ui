import React, { useState } from 'react';
import { TaskTitle } from './TaskTitle';
import { TaskDescription } from './TaskDescription';
import { TaskActions } from './TaskActions';
import { TASK_STYLES, DRAG_CONFIG } from './constants';
import type { DraggableTaskProps } from './types';

export function DraggableTask({ 
  task, 
  onDragStart, 
  onDragEnd, 
  onDelete,
  onUpdateTitle,
  onUpdateDescription
}: DraggableTaskProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(task.id, task.columnId);
    e.dataTransfer.effectAllowed = DRAG_CONFIG.effectAllowed;
    e.dataTransfer.setData(DRAG_CONFIG.dataFormat, JSON.stringify(task));
    e.dataTransfer.setData('text/order', (task.order || 1).toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const handleTitleUpdate = (newTitle: string) => {
    onUpdateTitle?.(task.id, newTitle);
  };

  const handleDescriptionUpdate = (newDescription: string) => {
    onUpdateDescription?.(task.id, newDescription);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={TASK_STYLES.container(isDragging)}
    >
      <div className="flex items-start gap-3">
        <div className={TASK_STYLES.indicator} />
        <div className={TASK_STYLES.content}>
          <TaskTitle
            title={task.title}
            onUpdate={handleTitleUpdate}
            isDragging={isDragging}
          />
          <TaskDescription
            description={task.description}
            onUpdate={handleDescriptionUpdate}
            isDragging={isDragging}
          />
          <TaskActions
            onDelete={onDelete}
            taskId={task.id}
          />
        </div>
      </div>
    </div>
  );
}
