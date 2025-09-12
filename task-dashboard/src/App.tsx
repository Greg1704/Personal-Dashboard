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

  return (
    <div>
        <h1>Personal Dashboard App</h1>
        <div className="bg-slate-900 p-10 flex justify-center items-center max-w-7xl">
          <div className="flex flex-row flex-wrap gap-2.5">
            {taskList}
          </div>
        </div>
    </div>
  );
}

export default App;