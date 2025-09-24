import React from 'react';
import { DraggableTask } from '~/components/board';
import type { Task, Column } from './types';

interface ColumnListProps {
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

const COLUMN_STYLES = {
    container: "overflow-x-auto pb-4 horizontal-scroll flex-1 flex",
    columnsWrapper: "flex gap-6 min-w-max px-1 h-full flex-1",
    column: (isDragOver: boolean) => 
        `bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-200 w-80 flex-shrink-0 flex flex-col min-h-full ${
            isDragOver 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-600'
        }`,
    columnHeader: "flex items-center justify-between mb-4",
    columnTitle: "heading-5 flex items-center gap-2",
    taskCount: "text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full",
    tasksContainer: "space-y-3 flex-1 overflow-y-auto min-h-0",
    addTaskButton: "w-full border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg p-4 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 flex-1 min-h-[60px]",
    addColumnCard: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 flex items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer w-80 flex-shrink-0 min-h-full",
    addColumnContent: "text-center",
    addColumnIcon: "w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3",
    addColumnTitle: "text-sm font-medium text-blue-600 dark:text-blue-400 mb-1",
    addColumnDescription: "text-xs text-blue-500 dark:text-blue-500"
} as const;

const ICONS = {
    plus: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    ),
    addColumn: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    )
} as const;

export function ColumnList({
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
}: ColumnListProps) {
    const getTasksForColumn = (columnId: number) => {
        return tasks
            .filter(task => task.columnId === columnId)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    return (
        <div className={COLUMN_STYLES.container}>
            <div 
                className={COLUMN_STYLES.columnsWrapper} 
                style={{ minWidth: `${Math.max(columns.length, 1) * 320}px` }}
            >
                {columns.map((column) => {
                    const columnTasks = getTasksForColumn(column.id);
                    const isDragOver = isColumnBeingDraggedOver(column.id);
                    
                    return (
                        <div 
                            key={column.id} 
                            className={COLUMN_STYLES.column(isDragOver)}
                            onDragOver={(e) => onDragOver(e, column.id)}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => {
                                if (e.defaultPrevented) return;
                                
                                const targetOrder = columnTasks.length + 1;
                                onDrop(e, column.id, targetOrder);
                            }}
                        >
                            <div className={COLUMN_STYLES.columnHeader}>
                                <h3 className={COLUMN_STYLES.columnTitle}>
                                    {column.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <span className={COLUMN_STYLES.taskCount}>
                                        {columnTasks.length}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={COLUMN_STYLES.tasksContainer}>
                                {columnTasks.map((task, taskIndex) => (
                                    <div
                                        key={task.id}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const targetOrder = taskIndex + 1;
                                            onDrop(e, column.id, targetOrder);
                                        }}
                                    >
                                        <DraggableTask
                                            task={task}
                                            onDragStart={onDragStart}
                                            onDragEnd={onDragEnd}
                                            onDelete={onDeleteTask}
                                            onUpdateTitle={onUpdateTaskTitle}
                                            onUpdateDescription={onUpdateTaskDescription}
                                        />
                                    </div>
                                ))}
                                
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const targetOrder = columnTasks.length + 1;
                                        onDrop(e, column.id, targetOrder);
                                    }}
                                    className="min-h-[60px] border-2 border-dashed border-transparent hover:border-blue-300 dark:hover:border-blue-600 rounded-lg transition-colors"
                                >
                                    <button 
                                        onClick={() => onAddTaskClick(column.id)}
                                        className={COLUMN_STYLES.addTaskButton}
                                    >
                                        {ICONS.plus}
                                        Add a task
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {/* Add Column Card */}
                <div 
                    className={COLUMN_STYLES.addColumnCard}
                    onClick={onCreateColumn}
                >
                    <div className={COLUMN_STYLES.addColumnContent}>
                        <div className={COLUMN_STYLES.addColumnIcon}>
                            {ICONS.addColumn}
                        </div>
                        <h3 className={COLUMN_STYLES.addColumnTitle}>
                            Add Column
                        </h3>
                        <p className={COLUMN_STYLES.addColumnDescription}>
                            Create a new column
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
