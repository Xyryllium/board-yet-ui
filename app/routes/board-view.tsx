import type { Route } from "./+types/board-view";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useBoards } from "~/hooks/useBoards";
import { LoadingSpinner, ErrorAlert, Notification } from "~/components/ui";
import { AddColumnModal, AddTaskModal } from "~/components/board";
import { useTaskDragAndDrop } from "~/components/board/hooks/useTaskDragAndDrop";
import type { CreateTaskData } from "~/api/types";

// Local imports
import { BoardHeader } from "~/components/board/BoardHeader";
import { BoardContent } from "~/components/board/BoardContent";
import { useNotification } from "~/hooks/useNotification";
import { useTaskManagement } from "~/hooks/useTaskManagement";
import { useBoardColumnManagement } from "~/hooks/useBoardColumnManagement";
import { useScrollProgress } from "~/hooks/useScrollProgress";
import { transformBoardTasksToTasks } from "~/lib/taskUtils";
import type { Task, Column } from "~/components/board/types";

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: `Board - Board Yet` },
        { name: "description", content: "View and manage your board" },
    ];
}

export default function BoardView({ params }: Route.ComponentProps) {
    const { isInitialized } = useAuth();
    const boardsHook = useBoards();
    const boardId = parseInt(params.id);
    const board = boardsHook.boards.find(b => b.id === boardId);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
    const [isAddingTask, setIsAddingTask] = useState(false);

    const { notification, showNotification, clearNotification } = useNotification();
    const { 
        tasks, 
        setTasks, 
        updateTask, 
        moveTask, 
        reorderTask, 
        deleteTask, 
        addTask 
    } = useTaskManagement({ 
        onError: (error) => showNotification(error, 'error'),
        onSuccess: (message) => showNotification(message, 'success')
    });
    
    const { addColumns, updateColumn, deleteColumn, reorderColumns } = useBoardColumnManagement({
        boardId,
        board,
        onError: (error: string) => showNotification(error, 'error')
    });

    useScrollProgress();

    const handleTaskMove = (taskId: string, fromColumnId: number, toColumnId: number) => {
        moveTask(taskId, fromColumnId, toColumnId);
    };

    const handleTaskReorder = (taskId: string, fromOrder: number, toOrder: number, columnId: number) => {
        reorderTask(taskId, fromOrder, toOrder, columnId);
    };

    const handleUpdateTaskTitle = (taskId: string, newTitle: string) => {
        updateTask(taskId, { title: newTitle });
    };

    const handleUpdateTaskDescription = (taskId: string, newDescription: string) => {
        updateTask(taskId, { description: newDescription });
    };

    const {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        isTaskBeingDragged,
        isColumnBeingDraggedOver
    } = useTaskDragAndDrop({ 
        onTaskMove: handleTaskMove,
        onTaskReorder: handleTaskReorder
    });

    useEffect(() => {
        if (!isInitialized || boardsHook.hasFetched) return;
        
        const fetchBoardAndExtractTasks = async () => {
            await boardsHook.fetchSpecificBoard(boardId);
        };
        
        fetchBoardAndExtractTasks();
    }, [isInitialized, boardsHook.hasFetched]);

    useEffect(() => {
        if (!board) return;
        const transformedTasks = transformBoardTasksToTasks(board);
        setTasks(transformedTasks);
    }, [board, setTasks]);


    const handleAddColumns = async (newColumns: Column[]) => {
        await addColumns(newColumns);
        boardsHook.fetchSpecificBoard(boardId, true).catch(console.error);
        setIsModalOpen(false);
    };

    const handleUpdateColumn = async (columnId: number, name: string, order?: number) => {
        await updateColumn(columnId, name, order);
        boardsHook.fetchSpecificBoard(boardId, true).catch(console.error);
    };

    const handleDeleteColumn = async (columnId: number) => {
        await deleteColumn(columnId);
        boardsHook.fetchSpecificBoard(boardId, true).catch(console.error);
    };

    const handleReorderColumns = async (reorderedColumns: Column[]) => {
        await reorderColumns(reorderedColumns);
        boardsHook.fetchSpecificBoard(boardId, true).catch(console.error);
    };

    const handleAddTaskClick = (columnId: number) => {
        setSelectedColumnId(columnId);
        setIsAddTaskModalOpen(true);
    };

    const handleAddTask = async (taskData: CreateTaskData) => {
        setIsAddingTask(true);
        try {
            await addTask(taskData);
            setIsAddTaskModalOpen(false);
            setSelectedColumnId(null);
        } catch (error) {
            console.error('Failed to add task:', error);
        } finally {
            setIsAddingTask(false);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        deleteTask(taskId);
    };

    if (boardsHook.isLoading || !boardsHook.hasFetched) {
        return (
            <div className="page-container flex items-center justify-center">
                <LoadingSpinner size="lg" message="Loading board..." />
            </div>
        );
    }

    if (!board) {
        return (
            <div className="page-container">
                <div className="container mx-auto px-4 py-8">
                    <ErrorAlert error="Board not found" onDismiss={() => {}} />
                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/boards"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        >
                            Back to Boards
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container min-h-screen">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={clearNotification}
                />
            )}
            <div className="container mx-auto px-4 py-6 h-full flex flex-col">
                <BoardHeader
                    boardName={board.name || 'Unnamed Board'}
                    boardDescription={board.description || 'No description provided'}
                    columnCount={board.columns.length}
                    columnCreatedAt={board.created_at}
                />

                <BoardContent
                    columns={board.columns}
                    tasks={tasks}
                    isColumnBeingDraggedOver={isColumnBeingDraggedOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e, columnId, targetOrder) => handleDrop(e, columnId, targetOrder)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTaskTitle={handleUpdateTaskTitle}
                    onUpdateTaskDescription={handleUpdateTaskDescription}
                    onAddTaskClick={handleAddTaskClick}
                    onCreateColumn={() => setIsModalOpen(true)}
                />

                <AddColumnModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddColumns={handleAddColumns}
                    onUpdateColumn={handleUpdateColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onReorderColumns={handleReorderColumns}
                    existingColumns={board.columns.map(col => ({
                        ...col,
                        order: col.order ?? 0
                    }))}
                    isLoading={false}
                />
                
                {selectedColumnId && (
                    <AddTaskModal
                        isOpen={isAddTaskModalOpen}
                        onClose={() => {
                            setIsAddTaskModalOpen(false);
                            setSelectedColumnId(null);
                        }}
                        onAddTask={handleAddTask}
                        columnId={selectedColumnId}
                        columnName={board.columns.find(col => col.id === selectedColumnId)?.name || 'Unknown Column'}
                        isLoading={isAddingTask}
                        existingTasks={tasks.filter(task => task.columnId === selectedColumnId)}
                    />
                )}
            </div>
        </div>
    );
}