// src/App.tsx
import { useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { Sidebar } from './components/Sidebar';
import { TaskForm } from './components/TaskForm';
import {tasks as taskData} from './data/tasks';
import {checkboxes} from './data/checkboxes';

function App() {

  //state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCheckboxes, setFilterCheckboxes] = useState(checkboxes);
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

  
  const taskList = filteredTasks.map((task) => (
    <TaskCard key={task.id} task={task} onStatusChange={onTaskStatusChange}/>
  ));

  const taskBoard = (
      <div className="bg-slate-900 flex flex-row rounded-lg m-5 min-w-fit">
        <div className="bg-red-500 w-1/5 p-10 rounded-l-lg min-w-64">
          <Sidebar searchTerm={searchTerm} onSearchChange={setSearchTerm}  checkboxes={filterCheckboxes} onCheckboxChange={onCheckboxChange}/>
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
          <h1 className="text-4xl font-bold text-white text-center p-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Personal Dashboard
          </h1>
        </header>
        <button onClick={() => setIsFormOpen(true)} className='bg-yellow-500 text-white hover:bg-blue-600'>Abrir formulario</button>
        <div className ="mx-5 my-5">
          {taskBoard}
        </div>
        {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-slate-800 p-5 rounded-lg shadow-lg w-96">
              <TaskForm onClose={() => setIsFormOpen(false)} addTask={addTask}/>
            </div>
          </div>}
    </div>
  );
}

export default App;