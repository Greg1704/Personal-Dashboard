import { type Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-yellow-800 text-2xl font-bold mb-3">{task.title}</h2>
      <p className="text-gray-700 mb-2">{task.description}</p>
      <p className="text-sm font-medium">
        Status: <span className={task.completed ? 'text-green-600' : 'text-orange-500'}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </p>
    </div>
  );
}