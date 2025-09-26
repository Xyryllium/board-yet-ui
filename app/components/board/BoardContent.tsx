import React from 'react';
import { EmptyBoard } from './EmptyBoard';
import { ColumnList } from './ColumnList';
import type { Task, Column } from './types';

interface BoardContentProps {
    columns: Column[];
    tasks: Task[];
    isColumnBeingDraggedOver: (columnId: number) => boolean;
    onDragOver: (e: React.DragEvent, columnId: number) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, columnId: number, targetOrder?: number) => void;
    onDragStart: (taskId: string, columnId: number) => void;
    onDragEnd: () => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTaskTitle: (taskId: string, newTitle: string) => void;
    onUpdateTaskDescription: (taskId: string, newDescription: string) => void;
    onAddTaskClick: (columnId: number) => void;
    onCreateColumn: () => void;
}

const BOARD_STYLES = {
    container: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col w-full",
    content: "p-4 sm:p-6 flex-1 flex flex-col min-h-0"
} as const;

export function BoardContent({
    columns,
    tasks,
    isColumnBeingDraggedOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragStart,
    onDragEnd,
    onDeleteTask,
    onUpdateTaskTitle,
    onUpdateTaskDescription,
    onAddTaskClick,
    onCreateColumn
}: BoardContentProps) {
    return (
        <div className={BOARD_STYLES.container}>
            {columns.length === 0 ? (
                <EmptyBoard onCreateColumn={onCreateColumn} />
            ) : (
                <div className={BOARD_STYLES.content}>
                    <ColumnList
                        columns={columns}
                        tasks={tasks}
                        isColumnBeingDraggedOver={isColumnBeingDraggedOver}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDeleteTask={onDeleteTask}
                        onUpdateTaskTitle={onUpdateTaskTitle}
                        onUpdateTaskDescription={onUpdateTaskDescription}
                        onAddTaskClick={onAddTaskClick}
                        onCreateColumn={onCreateColumn}
                    />
                </div>
            )}
        </div>
    );
}
