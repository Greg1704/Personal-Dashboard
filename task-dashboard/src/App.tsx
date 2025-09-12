// src/App.tsx
import { useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { type Task } from './types/Task';
import {tasks} from './data/tasks';
import { Divide } from 'lucide-react';

function App() {

  const taskList = tasks.map((task) => (
    <TaskCard key={task.id} task={task} />
  ));

  const taskBoard = (
      <div className="bg-slate-900 p-10 flex justify-center items-center max-w-7xl">
        <div className="flex flex-row flex-wrap gap-2.5">
          {taskList}
        </div>
      </div>
  );

  return (
    <div>
        <header>
          <h1 className="text-4xl font-bold text-white text-center p-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Personal Dashboard
          </h1>
        </header>
        {taskBoard}
    </div>
  );
}

export default App;