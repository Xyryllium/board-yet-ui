export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: number;
  order?: number;
}

export interface DraggableTaskProps {
  task: Task;
  onDragStart: (taskId: string, columnId: number) => void;
  onDragEnd: () => void;
  onDelete?: (taskId: string) => void;
  onUpdateTitle?: (taskId: string, newTitle: string) => void;
  onUpdateDescription?: (taskId: string, newDescription: string) => void;
}

export interface EditingState {
  isEditing: boolean;
  editValue: string;
}

export interface EditingHandlers {
  onStartEdit: () => void;
  onValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
}

export interface Column {
    id: number;
    name: string;
    order?: number;
}

export interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface BoardViewState {
    isModalOpen: boolean;
    isAddTaskModalOpen: boolean;
    selectedColumnId: number | null;
    isAddingTask: boolean;
    notification: NotificationState | null;
    tasks: Task[];
}

export interface TaskUpdateData {
    title?: string;
    description?: string;
    column_id?: number;
    order?: number;
}

export interface ColumnUpdateData {
    name: string;
    order?: number;
}
