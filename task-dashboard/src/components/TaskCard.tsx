import { useState } from 'react';
import { type Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
}
export function TaskCard({ task }: TaskCardProps) {

  const [status, setStatus] = useState(task.completed);


  return (
    <div className="bg-slate-600 max-w-xs max-h-80 rounded-lg shadow-lg">
      <div className='p-3'>
        <h2 className="text-3xl">{task.title}</h2>
        <p className="text-sm  pt-4">
          Status: <button onClick={() => setStatus(!status)} className={`px-2 py-1 rounded text-white text-xs font-semibold ${status ? 'bg-green-600' : 'bg-red-600'}`}>
                    {status? 'Completed' : 'Pending'}
                  </button>
        </p>
      </div>
      <div className='bg-stone-400 p-2 mt-2 rounded-b-lg'>
        <p className="">{task.description}</p>
      </div>
    </div>
  );
}