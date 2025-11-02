// src/Dashboard.tsx
import { lazy, Suspense, useMemo, useCallback, useState, useEffect } from 'react';
import { TaskCard } from '../components/TaskCard';
import { Sidebar } from '../components/Sidebar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ModalBackdrop } from '../components/ModalBackdrop';
import toast, { Toaster } from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';
import { useTaskAnimations } from '../hooks/useTaskAnimations';
import { useMultipleModals } from '../hooks/useModalState';
import { useFilterStore } from '../stores/useFilterStore';
import { useAuthStore } from '../stores/useAuthStore';
import { taskUtils } from '../utils/taskUtils';
import { type Task } from '../types/Task';
import { type TaskSubmitData } from '../types/TaskSubmitData';
import { migrateLocalStorageToFirestore, hasMigrated } from '../utils/migrateData';

// React Query hooks
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';

// Lazy loading de componentes de modales para code splitting
const TaskForm = lazy(() =>
import('../components/TaskForm').then(module => ({ default: module.TaskForm }))
);
const CategoryManager = lazy(() =>
import('../components/CategoryManager').then(module => ({ default: module.CategoryManager }))
);

function Dashboard() {
    // Auth
    const user = useAuthStore(state => state.user);

    // React Query - Fetch data
    const { data: tasks = [], isLoading: isLoadingTasks, error: tasksError } = useTasks();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

    // React Query - Mutations
    const addTaskMutation = useAddTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const addCategoryMutation = useAddCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    // Zustand stores (solo UI state)
    const { searchTerm, setSearchTerm, filterCheckboxes, toggleCheckbox, clearAllCheckboxes, selectedCategories, setSelectedCategories } = useFilterStore();

    // Local state para modales y confirmaciones
    const modals = useMultipleModals();
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);

    // Migration effect - ejecutar una sola vez al cargar
    useEffect(() => {
        if (user && !hasMigrated()) {
            migrateLocalStorageToFirestore(user.uid)
                .then(() => {
                    toast.success('Data migrated to cloud!', { duration: 5000 });
                })
                .catch((error) => {
                    console.error('Migration error:', error);
                    toast.error('Failed to migrate data. Please try again later.');
                });
        }
    }, [user]);

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
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        updateTaskMutation.mutate({
            id,
            updates: { completed }
        });
    }, [tasks, updateTaskMutation]);

    const handleAddOrUpdateTask = useCallback((taskData: TaskSubmitData) => {
        if (!taskData.id) {
            // Add new task
            addTaskMutation.mutate({
                title: taskData.title,
                description: taskData.description || '',
                completed: false,
                categoryId: taskData.categoryId || '0'
            });
            modals.createForm.close();
        } else {
            // Update existing task
            updateTaskMutation.mutate({
                id: taskData.id,
                updates: {
                    title: taskData.title,
                    description: taskData.description || '',
                    categoryId: taskData.categoryId || '0'
                }
            });
            setEditingTask(null);
            modals.editForm.close();
        }
    }, [addTaskMutation, updateTaskMutation, modals.createForm, modals.editForm]);

    const handleAddCategory = useCallback((name: string, color: string) => {
        addCategoryMutation.mutate({ name, color });
    }, [addCategoryMutation]);

    const handleEditCategory = useCallback((id: string, newName: string) => {
        updateCategoryMutation.mutate({ id, updates: { name: newName } });
    }, [updateCategoryMutation]);

    const handleRequestRemoveCategory = useCallback((id: string) => {
        setCategoryToDelete(id);
    }, []);

    const handleRemoveCategory = useCallback(() => {
        if (!categoryToDelete) return;

        // Actualizar tareas que tengan esta categoría a "No Category" (id "0")
        const tasksWithCategory = tasks.filter(task => task.categoryId === categoryToDelete);
        tasksWithCategory.forEach(task => {
            updateTaskMutation.mutate({
                id: task.id,
                updates: { categoryId: '0' }
            });
        });

        // Eliminar la categoría
        deleteCategoryMutation.mutate(categoryToDelete);
        setCategoryToDelete(null);
    }, [categoryToDelete, tasks, deleteCategoryMutation, updateTaskMutation]);

    const handleRequestRemoveTask = useCallback((id: string) => {
        setTaskToDelete(id);
    }, []);

    const handleRemoveTask = useCallback(() => {
        if (!taskToDelete) return;

        const task = tasks.find(t => t.id === taskToDelete);
        if (task) {
            setLastDeletedTask(task);
        }

        addRemovingTask(taskToDelete);
        setTaskToDelete(null);
        modals.editForm.closeImmediately();

        setTimeout(() => {
            deleteTaskMutation.mutate(taskToDelete);
            removeRemovingTask(taskToDelete);
        }, 500);
    }, [taskToDelete, tasks, deleteTaskMutation, addRemovingTask, removeRemovingTask, modals.editForm]);

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
            addTaskMutation.mutate(lastDeletedTask);
            setLastDeletedTask(null);
        } else {
            toast.error('No task to restore');
        }
    }, [lastDeletedTask, addTaskMutation]);

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

    // Loading state
    if (isLoadingTasks || isLoadingCategories) {
        return (
            <div className='min-h-screen bg-slate-800 flex items-center justify-center'>
                <div className="text-white text-2xl">Loading your tasks...</div>
            </div>
        );
    }

    // Error state
    if (tasksError) {
        return (
            <div className='min-h-screen bg-slate-800 flex items-center justify-center'>
                <div className="text-red-400 text-2xl">Error loading tasks. Please try again.</div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className='min-h-screen bg-slate-800 pb-3'>
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

export default Dashboard;
