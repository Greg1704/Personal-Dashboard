// src/App.tsx
import { useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { type Task } from './types/Task';
import { Divide } from 'lucide-react';

function App() {

  const task = {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task description.',
    completed: true,
  } as Task;

  return (
    <div>
        <h1>Hello</h1>
        <TaskCard task={task} />
    </div>
  );
}

export default App;