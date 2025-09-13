// src/App.tsx
import { useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { Sidebar } from './components/Sidebar';
import {tasks} from './data/tasks';
import { Divide } from 'lucide-react';

function App() {

  //state variables
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taskList = filteredTasks.map((task) => (
    <TaskCard key={task.id} task={task} />
  ));

  const taskBoard = (
      <div className="bg-slate-900 w-12/12 flex flex-row rounded-lg m-5">
        <div className="bg-red-500 w-1/5 p-10 rounded-l-lg">
          <Sidebar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <div className='p-10 flex justify-center items-center'>
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
        <div className ="flex justify-center items-center">
          {taskBoard}
        </div>
    </div>
  );
}

export default App;