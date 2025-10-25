// src/components/TaskModal.tsx
import { type Task } from '../types/Task';
import { type Category } from '../types/Category';
import { type TaskSubmitData } from '../types/TaskSubmitData';
import { TaskForm } from './TaskForm';
import { ModalBackdrop } from './ModalBackdrop';

interface TaskModalProps {
  mode: 'create' | 'edit';
  task?: Task;
  categories: Category[];
  isClosing: boolean;
  onClose: () => void;
  onSubmit: (data: TaskSubmitData) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal = ({
  mode,
  task,
  categories,
  isClosing,
  onClose,
  onSubmit,
  onDelete
}: TaskModalProps) => {
  return (
    <ModalBackdrop isClosing={isClosing} onClose={onClose}>
      <TaskForm
        mode={mode}
        task={task}
        categories={categories}
        onClose={onClose}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </ModalBackdrop>
  );
};
