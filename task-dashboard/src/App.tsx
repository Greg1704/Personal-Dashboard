// src/App.tsx
import { useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';
import {tasks as taskData} from './data/tasks';
import {stateCheckboxes} from './data/stateCheckboxes';
import {categories as categoryData} from './data/categories';

function App() {

  //state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCheckboxes, setFilterCheckboxes] = useState(stateCheckboxes);
  const [categories, setCategories] = useState(categoryData);
  const [tasks, setTasks] = useState(taskData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const activeCheckboxes = filterCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);

  const filteredTasks = tasks.filter(task =>
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    && (activeCheckboxes.length === 0 || activeCheckboxes.includes(task.completed ? 'Completed' : 'Pending'))
  );

  function onCheckboxChange(id: string, checked: boolean) {
    const updatedCheckboxes = filterCheckboxes.map(checkbox =>
      checkbox.id === id ? { ...checkbox, checked } : checkbox
    );
    setFilterCheckboxes(updatedCheckboxes);
  }

  function onTaskStatusChange(id: string, completed: boolean) {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
  }

  function addTask(title: string, description: string) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false
    };
    setTasks([...tasks, newTask]);
  }

  
  const taskList = filteredTasks.map((task) => {
    const category = categories.find((cat) => cat.id === task.categoryId);
    return (
      <TaskCard 
        key={task.id} 
        task={task} 
        onStatusChange={onTaskStatusChange} 
        color={category?.color}
        categoryName={category?.name}
      />
    );
  });

  const taskBoard = (
      <div className="bg-slate-900 flex flex-row rounded-lg m-5 min-w-fit">
        <div className="bg-slate-700 w-1/5 p-10 rounded-l-lg min-w-64 border-r border-slate-600">          
          <Sidebar searchTerm={searchTerm} onSearchChange={setSearchTerm}  checkboxes={filterCheckboxes} onCheckboxChange={onCheckboxChange} setIsFormOpen={setIsFormOpen}/>
        </div>
        <div className='p-10 flex justify-center items-center flex-1 min-w-96'>
          <div className="flex flex-row flex-wrap gap-2.5 justify-center">
            {taskList}
          </div>
        </div>
      </div>
  );

  return (
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
          <div onClick={() => setIsFormOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-slate-800 p-5 rounded-lg shadow-lg w-96">
              <TaskForm onClose={() => setIsFormOpen(false)} addTask={addTask}/>
            </div>
          </div>
        }
    </div>
  );
}

export default App;