import { type Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, completed: boolean) => void;
  color?: string;
  categoryName?: string;
  onTaskClick: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, color, categoryName, onTaskClick }: TaskCardProps) {
  return (
    <div 
      onClick={() => onTaskClick(task)}
      className="w-72 h-64 rounded-lg shadow-lg flex flex-col bg-slate-600 border-l-4"
      style={{ borderLeftColor: color || '#64748b' }} // slate-500 por defecto
    >
      <div className='p-3'>
        <h2 className="text-3xl py-1 w-full truncate text-white">{task.title}</h2>
        <div className='pt-2 flex  items-center  justify-between'>
          <p className="py-1 text-sm text-gray-200">
            Status: <button onClick={(e)=>{
                                            e.stopPropagation(); 
                                            onStatusChange(task.id, !task.completed)
                                          }} 
                            className={`px-2 rounded text-white text-xs font-semibold transition-colors 
                                      ${task.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                      {task.completed? 'Completed' : 'Pending'}
                    </button>
          </p>
          {categoryName && (
            <span 
              className="inline-block px-2 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {categoryName}
            </span>
          )}
        </div>
      </div>
      <div className='bg-slate-500 p-2 rounded-b-lg flex-1'>
        <p className="w-full line-clamp-5 text-gray-100">{task.description}</p>
      </div>
    </div>
  );
}