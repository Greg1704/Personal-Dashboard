// src/App.tsx
import { lazy, Suspense, useMemo, useCallback, useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { Sidebar } from './components/Sidebar';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ModalBackdrop } from './components/ModalBackdrop';
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from './hooks/useDebounce';
import { useTaskAnimations } from './hooks/useTaskAnimations';
import { useMultipleModals } from './hooks/useModalState';
import { useTaskStore } from './stores/useTaskStore';
import { useCategoryStore } from './stores/useCategoryStore';
import { useFilterStore } from './stores/useFilterStore';
import { taskUtils } from './utils/taskUtils';
import { type Task } from './types/Task';
import { type TaskSubmitData } from './types/TaskSubmitData';

// Lazy loading de componentes de modales para code splitting
const TaskForm = lazy(() =>
  import('./components/TaskForm').then(module => ({ default: module.TaskForm }))
);
const CategoryManager = lazy(() =>
  import('./components/CategoryManager').then(module => ({ default: module.CategoryManager }))
);

function App() {
  // Zustand stores
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, removeCategoryFromTasks, restoreLastDeletedTask, lastDeletedTask } = useTaskStore();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { searchTerm, setSearchTerm, filterCheckboxes, toggleCheckbox, clearAllCheckboxes, selectedCategories, setSelectedCategories } = useFilterStore();

  // Local state para modales y confirmaciones
  const modals = useMultipleModals();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Computed values usando utilidades
  const activeCheckboxes = useMemo(
    () => taskUtils.getActiveCheckboxes(filterCheckboxes),
    [filterCheckboxes]
  );

  const filteredTasks = useMemo(
    () => taskUtils.filterTasks(tasks, debouncedSearchTerm, activeCheckboxes, selectedCategories),
    [tasks, debouncedSearchTerm, activeCheckboxes, selectedCategories]
  );

  const pendingTasksCount = useMemo(() => taskUtils.countPendingTasks(tasks), [tasks]);
  const completedTasksCount = useMemo(() => taskUtils.countCompletedTasks(tasks), [tasks]);
  const categoryCounts = useMemo(() => taskUtils.countTasksByCategory(tasks, categories), [tasks, categories]);

  // Hook de animaciones
  const {
    tasksToRenderWithAnimations,
    addRemovingTask,
    removeRemovingTask,
    isTaskRemoving,
    isTaskExiting,
    isTaskEntering
  } = useTaskAnimations(filteredTasks, tasks);

  // Handlers
  const handleCheckboxChange = useCallback((id: string, checked: boolean) => {
    toggleCheckbox(id, checked);
  }, [toggleCheckbox]);

  const handleClearAllCheckboxes = useCallback(() => {
    clearAllCheckboxes();
  }, [clearAllCheckboxes]);

  const handleSelectedCategoriesChange = useCallback((categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
  }, [setSelectedCategories]);

  const handleTaskStatusChange = useCallback((id: string, completed: boolean) => {
    toggleTaskStatus(id, completed);
  }, [toggleTaskStatus]);

  const handleAddOrUpdateTask = useCallback((taskData: TaskSubmitData) => {
    if (!taskData.id) {
      addTask(taskData);
      toast.success('Task created successfully');
      modals.createForm.close();
    } else {
      updateTask(taskData);
      toast.success('Task updated successfully');
      setEditingTask(null);
      modals.editForm.close();
    }
  }, [addTask, updateTask, modals.createForm, modals.editForm]);

  const handleAddCategory = useCallback((name: string, color: string) => {
    addCategory(name, color);
    toast.success('Category added successfully');
  }, [addCategory]);

  const handleEditCategory = useCallback((id: string, newName: string) => {
    updateCategory(id, newName);
    toast.success('Category updated successfully');
  }, [updateCategory]);

  const handleRequestRemoveCategory = useCallback((id: string) => {
    setCategoryToDelete(id);
  }, []);

  const handleRemoveCategory = useCallback(() => {
    if (!categoryToDelete) return;

    deleteCategory(categoryToDelete);
    removeCategoryFromTasks(categoryToDelete);
    setCategoryToDelete(null);
    toast.success('Category deleted successfully');
  }, [categoryToDelete, deleteCategory, removeCategoryFromTasks]);

  const handleRequestRemoveTask = useCallback((id: string) => {
    setTaskToDelete(id);
  }, []);

  const handleRemoveTask = useCallback(() => {
    if (!taskToDelete) return;

    addRemovingTask(taskToDelete);
    setTaskToDelete(null);
    modals.editForm.closeImmediately();

    setTimeout(() => {
      deleteTask(taskToDelete);
      removeRemovingTask(taskToDelete);
      toast.success('Task deleted successfully');
    }, 500);
  }, [taskToDelete, deleteTask, addRemovingTask, removeRemovingTask, modals.editForm]);

  const handleCancelDelete = useCallback(() => {
    setTaskToDelete(null);
    setCategoryToDelete(null);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    modals.editForm.open();
  }, [modals.editForm]);

  const handleUndoDelete = useCallback(() => {
    if (lastDeletedTask) {
      restoreLastDeletedTask();
      toast.success('Task restored successfully');
    } else {
      toast.error('No task to restore');
    }
  }, [lastDeletedTask, restoreLastDeletedTask]);

  // Render task list
  const taskList = useMemo(() =>
    tasksToRenderWithAnimations.map((task) => {
      const category = categories.find((cat) => cat.id === task.categoryId);
      return (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={handleTaskStatusChange}
          color={category?.color}
          categoryName={category?.name}
          onTaskClick={handleOpenEditModal}
          isRemoving={isTaskRemoving(task.id) || isTaskExiting(task.id)}
          isEntering={isTaskEntering(task.id)}
        />
      );
    }),
    [tasksToRenderWithAnimations, categories, handleTaskStatusChange, handleOpenEditModal, isTaskRemoving, isTaskExiting, isTaskEntering]
  );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='min-h-screen bg-slate-800 pb-3'>
        <header>
          <h1 className="text-4xl font-bold text-white text-center p-5 bg-indigo-600">
            Personal Dashboard
          </h1>
        </header>
        <div className="mx-5 my-10">
          <div className="bg-slate-900 flex flex-row rounded-lg m-5 mb-10 min-w-fit">
            <div className="bg-slate-700 w-1/5 p-10 rounded-l-lg min-w-64 border-r border-slate-600">
              <Sidebar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                checkboxes={filterCheckboxes}
                onCheckboxChange={handleCheckboxChange}
                completedTasksCount={completedTasksCount}
                pendingTasksCount={pendingTasksCount}
                onClearAllStateCheckboxes={handleClearAllCheckboxes}
                categories={categories}
                onSelectedCategoriesChange={handleSelectedCategoriesChange}
                selectedCategories={selectedCategories}
                categoryTaskCounts={categoryCounts}
                setIsFormOpen={modals.createForm.open}
                filteredTasksCount={filteredTasks.length}
                setIsCategoryManagerOpen={modals.categoryManager.open}
                onUndoLastDelete={handleUndoDelete}
                hasLastDeletedTask={lastDeletedTask !== null}
              />
            </div>
            <div className='p-10 flex-1 min-w-96'>
              <div className="flex flex-row flex-wrap gap-2.5 justify-center">
                {taskList.length > 0 ? taskList : <p className='text-white text-4xl'>No tasks found</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Modal */}
        {modals.createForm.isOpen && (
          <ModalBackdrop isClosing={modals.createForm.isClosing} onClose={modals.createForm.close}>
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <TaskForm
                mode='create'
                onClose={modals.createForm.close}
                onSubmit={handleAddOrUpdateTask}
                categories={categories}
              />
            </Suspense>
          </ModalBackdrop>
        )}

        {/* Edit Task Modal */}
        {editingTask && modals.editForm.isOpen && (
          <ModalBackdrop isClosing={modals.editForm.isClosing} onClose={modals.editForm.close}>
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <TaskForm
                mode='edit'
                task={editingTask}
                onClose={modals.editForm.close}
                onSubmit={handleAddOrUpdateTask}
                onDelete={handleRequestRemoveTask}
                categories={categories}
              />
            </Suspense>
            {taskToDelete && (
              <ConfirmDialog
                isOpen={true}
                title='Confirm Deletion'
                message='Are you sure you want to delete this task?'
                onConfirm={handleRemoveTask}
                onCancel={handleCancelDelete}
                confirmText='Delete'
                cancelText='Cancel'
              />
            )}
          </ModalBackdrop>
        )}

        {/* Category Manager Modal */}
        {modals.categoryManager.isOpen && (
          <ModalBackdrop isClosing={modals.categoryManager.isClosing} onClose={modals.categoryManager.close}>
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <CategoryManager
                categories={categories}
                categoriesCount={categoryCounts}
                onClose={modals.categoryManager.close}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleRequestRemoveCategory}
              />
            </Suspense>
            {categoryToDelete && (
              <ConfirmDialog
                isOpen={true}
                title='Confirm Deletion'
                message='Are you sure you want to delete this category?'
                onConfirm={handleRemoveCategory}
                onCancel={handleCancelDelete}
                confirmText='Delete'
                cancelText='Cancel'
              />
            )}
          </ModalBackdrop>
        )}
      </div>
    </>
  );
}

export default App;
