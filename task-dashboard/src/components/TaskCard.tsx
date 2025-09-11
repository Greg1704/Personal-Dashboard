// src/components/TaskCard.tsx
import { type Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        <button
          onClick={() => onToggle(task.id)}
          className={`px-4 py-2 rounded font-medium ${
            task.completed 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {task.completed ? 'Desmarcar' : 'Completar'}
        </button>
      </div>
    </div>
  );
}