// src/App.tsx
import { useState } from 'react';
import { TaskCard } from './components/TaskCard';
import { type Task } from './types/Task';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Aprender TypeScript',
    completed: false
  },
  {
    id: '2',
    title: 'Configurar Tailwind CSS',
    completed: true
  },
  {
    id: '3',
    title: 'Crear el dashboard de tareas',
    completed: false
  }
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggle = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🚀 Dashboard de Tareas
        </h1>
        
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggle={handleToggle} 
            />
          ))}
        </div>
        
        {/* Verificación visual de que Tailwind funciona */}
        <div className="mt-8 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-700 font-medium">
            ✅ ¡Tailwind CSS está funcionando correctamente!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;