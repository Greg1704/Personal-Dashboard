// src/App.tsx
import { useRef, useState, useEffect, useMemo } from 'react';
import { TaskCard } from './components/TaskCard';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';
import { CategoryManager } from './components/CategoryManager';
import {tasks as taskData} from './data/tasks';
import {stateCheckboxes} from './data/stateCheckboxes';
import {categories as categoryData} from './data/categories';
import { type Task } from './types/Task';
import { type TaskSubmitData } from './types/TaskSubmitData';
import { ConfirmDialog } from './components/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';

function App() {

  //state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCheckboxes, setFilterCheckboxes] = useState(stateCheckboxes);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState(categoryData);
  const [tasks, setTasks] = useState(taskData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormClosing, setIsFormClosing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditFormClosing, setIsEditFormClosing] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isCategoryManagerClosing, setIsCategoryManagerClosing] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  //state variables for animation
  const [removingTasks, setRemovingTasks] = useState<Set<string>>(new Set());
  const [enteringTasks, setEnteringTasks] = useState<Set<string>>(new Set());
  const [exitingTasks, setExitingTasks] = useState<Set<string>>(new Set());

  // Ref to store the previous filtered tasks
  const prevFilteredTasksRef = useRef<Task[]>([]);

  const activeCheckboxes = filterCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);

  const filteredTasks = tasks.filter(task =>
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) 
    || task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    && (activeCheckboxes.length === 0 || activeCheckboxes.includes(task.completed ? 'Completed' : 'Pending'))
    && (selectedCategories.length === 0 || ( task.categoryId && selectedCategories.includes(task.categoryId)))
  );

  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  const categoryCounts = categories.map(category => ({
    id: category.id,
    count: tasks.filter(task => task.categoryId === category.id).length
  }));

  //Use Memo Hooks

  const {tasksToRenderWithAnimations, newEnteringTasks, newExitingTasks} = useMemo(() => {
    const prevIds = new Set(prevFilteredTasksRef.current.map(task => task.id));
    const currentIds = new Set(filteredTasks.map(task => task.id));

    const tasksExiting = prevFilteredTasksRef.current.filter(
      task => !currentIds.has(task.id) && !removingTasks.has(task.id)
    )

    const tasksEntering = filteredTasks.filter(
      task => !prevIds.has(task.id) && !removingTasks.has(task.id)
    );

    const tasksToRender = tasks.filter(task =>
      currentIds.has(task.id) 
      || removingTasks.has(task.id)
      || exitingTasks.has(task.id)
      || tasksExiting.some(te => te.id === task.id)
    );

    return {tasksToRenderWithAnimations: tasksToRender, newEnteringTasks: tasksEntering, newExitingTasks: tasksExiting};

  },[filteredTasks, tasks, exitingTasks, removingTasks]);

  //Use Effect Hooks
  // Effect to handle exiting animation for tasks on filter change
  useEffect(() => {
    if (newExitingTasks.length > 0) {
      setExitingTasks(prev => {
        const newSet = new Set(prev);
        newExitingTasks.forEach(task => newSet.add(task.id));
        return newSet;
      });

      setTimeout(() => {
        setExitingTasks(prev => {
          const newSet = new Set(prev);
          newExitingTasks.forEach(task => newSet.delete(task.id));
          return newSet;
        });
      }, 500);
    }

    if (newEnteringTasks.length > 0) {
      setEnteringTasks(prev => {
        const newSet = new Set(prev);
        newEnteringTasks.forEach(task => newSet.add(task.id));
        return newSet;
      });

      setTimeout(() => {
        setEnteringTasks(prev => {
          const newSet = new Set(prev);
          newEnteringTasks.forEach(task => newSet.delete(task.id));
          return newSet;
        });
      }, 600);
    }

    prevFilteredTasksRef.current = filteredTasks;
  }, [filteredTasks, newExitingTasks, newEnteringTasks]);

  // Functions

  function onCheckboxChange(id: string, checked: boolean) {
    const updatedCheckboxes = filterCheckboxes.map(checkbox =>
      checkbox.id === id ? { ...checkbox, checked } : checkbox
    );
    setFilterCheckboxes(updatedCheckboxes);
  }

  function onSelectedCategoriesChange(categioriesIds: string[]) {
    setSelectedCategories(categioriesIds);
  }

  function onTaskStatusChange(id: string, completed: boolean) {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
  }

  function addTask({id, title, description, categoryId}: TaskSubmitData) {
    if(!id){
      const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
        categoryId
      };
      setTasks([...tasks, newTask]);
      toast.success('Task created successfully');
    }else{
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, title, description, categoryId } : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
      toast.success('Task updated successfully');
    }
  }

  function addCategory(name: string, color: string) {
    const newCategory = {
      id: crypto.randomUUID(),
      name,
      color
    };
    setCategories([...categories, newCategory]);
    toast.success('Category added successfully');
  }

  function editCategory(id: string, newName: string) {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, name: newName } : category
    );
    setCategories(updatedCategories);
    toast.success('Category updated successfully');
  }

  function requestRemoveCategory(id: string) {
    setCategoryToDelete(id);
  }

  function removeCategory() {
    const id = categoryToDelete;
    if(!id) return;
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);

    const updatedTasks = tasks.map(task => task.categoryId === id ? { ...task, categoryId: "0" } : task );
    setTasks(updatedTasks);

    setCategoryToDelete(null);

    toast.success('Category deleted successfully');
  }
  
  function requestRemoveTask(id: string) {
    setTaskToDelete(id);
  }

  function removeTask() {
    if(taskToDelete)
    {  
      setRemovingTasks(new Set(removingTasks).add(taskToDelete));

      const taskToDeleteId = taskToDelete;
      
      // Cerrar el ConfirmDialog inmediatamente
      setTaskToDelete(null);
      
      // Cerrar el TaskForm con animación
      closeEditForm();

      setTimeout(() => {
        const updatedTasks = tasks.filter(task => task.id !== taskToDeleteId);
        setTasks(updatedTasks);
        setRemovingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskToDeleteId!);
          return newSet;
        });
      }, 500); 
      toast.success('Task deleted successfully');
    }
  }

  function cancelDelete() {
    // Solo cerrar el ConfirmDialog, el TaskForm queda abierto
    if(taskToDelete){
      setTaskToDelete(null);
    }else if(categoryToDelete){
      setCategoryToDelete(null);
    }
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
  }

  const taskList = tasksToRenderWithAnimations.map((task) => {
    const category = categories.find((cat) => cat.id === task.categoryId);
    const isRemoving = removingTasks.has(task.id);
    const isExiting = exitingTasks.has(task.id) || newExitingTasks.some(te => te.id === task.id);
    const isEntering = enteringTasks.has(task.id) || newEnteringTasks.some(te => te.id === task.id);
    return (
      <TaskCard 
        key={task.id} 
        task={task} 
        onStatusChange={onTaskStatusChange} 
        color={category?.color}
        categoryName={category?.name}
        onTaskClick={openEditModal}
        isRemoving = {isRemoving || isExiting}
        isEntering = {isEntering}
      />
    );
  });

  //Functions to close components with animation
  function closeCreateForm() {
    setIsFormClosing(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setIsFormClosing(false);
    }, 300);
  }

  function closeEditForm() {
    setIsEditFormClosing(true);
    setTimeout(() => {
      setEditingTask(null);
      setIsEditFormClosing(false);
    }, 300);
  }

  function closeCategoryManager() {
    setIsCategoryManagerClosing(true);
    setTimeout(() => {
      setIsCategoryManagerOpen(false);
      setIsCategoryManagerClosing(false);
    }, 300);
  }

  const taskBoard = (
      <div className="bg-slate-900 flex flex-row rounded-lg m-5 mb-10 min-w-fit">
        <div className="bg-slate-700 w-1/5 p-10 rounded-l-lg min-w-64 border-r border-slate-600">          
          <Sidebar  searchTerm={searchTerm} onSearchChange={setSearchTerm}  
                    checkboxes={filterCheckboxes} onCheckboxChange={onCheckboxChange} completedTasksCount={completedTasksCount} pendingTasksCount={pendingTasksCount}
                    onClearAllStateCheckboxes={() => {
                      const updatedCheckboxes = filterCheckboxes.map(checkbox => ({...checkbox, checked: false}));
                      setFilterCheckboxes(updatedCheckboxes);
                    }}
                    categories={categories} onSelectedCategoriesChange={onSelectedCategoriesChange} selectedCategories={selectedCategories} categoryTaskCounts={categoryCounts}
                    setIsFormOpen={setIsFormOpen}
                    filteredTasksCount={filteredTasks.length}
                    setIsCategoryManagerOpen={setIsCategoryManagerOpen}
          />
        </div>
        <div className='p-10 flex-1 min-w-96'>
          <div className="flex flex-row flex-wrap gap-2.5 justify-center">
            {taskList.length > 0 ? taskList : <p className='text-white text-4xl'>No tasks found</p>}
          </div>
        </div>
      </div>
  );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='min-h-screen bg-gradient-to-b from-slate-800 to-slate-900'>
          <header>
            <h1 className="text-4xl font-bold text-white text-center p-5 bg-indigo-600">
              Personal Dashboard
            </h1>
          </header>
          <div className ="mx-5 my-5">
            {taskBoard}
          </div>
          {isFormOpen && 
            <div onClick={() => setIsFormOpen(false)} className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
                                                                  ${isFormClosing ? 'animate-backdropExit' : 'animate-backdropEnter'}`}
            >
              <div onClick={(e) => e.stopPropagation()} className={`bg-slate-800 p-5 rounded-lg shadow-lg w-96 ${isFormClosing ? 'animate-modalExit' : 'animate-modalEnter'}`}>
                <TaskForm mode={'create'} onClose={closeCreateForm} onSubmit={addTask} categories={categories}/>
              </div>
            </div>
          }
          {editingTask && 
            <div onClick={closeEditForm} className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
                                                                  ${isEditFormClosing ? 'animate-backdropExit' : 'animate-backdropEnter'}`}
            >
              <div onClick={(e) => e.stopPropagation()} className={`bg-slate-800 p-5 rounded-lg shadow-lg w-96 ${isEditFormClosing ? 'animate-modalExit' : 'animate-modalEnter'}`}>
                <TaskForm mode={'edit'} task={editingTask} onClose={closeEditForm} onSubmit={addTask} onDelete={requestRemoveTask} categories={categories}/>
              </div>
              {/* ConfirmDialog aparece SOBRE el TaskForm con z-index mayor */}
              {taskToDelete &&
                <ConfirmDialog  
                  isOpen={true} 
                  title='Confirm Deletion' 
                  message='Are you sure you want to delete this task?' 
                  onConfirm={removeTask} 
                  onCancel={cancelDelete} 
                  confirmText='Delete' 
                  cancelText='Cancel'
                />
              }
            </div>
          }
          {isCategoryManagerOpen &&
            <div onClick={closeCategoryManager} className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
                                                                  ${isCategoryManagerClosing ? 'animate-backdropExit' : 'animate-backdropEnter'}`}
            >
              <div onClick={(e) => e.stopPropagation()} className={`bg-slate-800 p-5 rounded-lg shadow-lg w-96 
                                                                  ${isCategoryManagerClosing ? 'animate-modalExit' : 'animate-modalEnter'}`}>
                <CategoryManager  categories={categories} categoriesCount={categoryCounts} onClose={closeCategoryManager} onAddCategory={addCategory}
                                  onEditCategory={editCategory} onDeleteCategory={requestRemoveCategory}
                />
              </div>
              {categoryToDelete &&
                <ConfirmDialog  
                  isOpen={true} 
                  title='Confirm Deletion' 
                  message='Are you sure you want to delete this category?' 
                  onConfirm={removeCategory} 
                  onCancel={cancelDelete} 
                  confirmText='Delete' 
                  cancelText='Cancel'
                />
              }
            </div>
          }
      </div>
    </>
  );
}

export default App;