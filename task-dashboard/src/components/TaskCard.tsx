import { useState } from 'react';
import { type Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, completed: boolean) => void;
}
export function TaskCard({ task, onStatusChange }: TaskCardProps) {


  return (
    <div className="bg-slate-600 w-72 h-64 rounded-lg shadow-lg flex flex-col">
      <div className='p-3'>
        <h2 className="text-3xl py-1 w-full truncate">{task.title}</h2>
        <p className="text-sm  pt-2">
          Status: <button onClick={(e)=>onStatusChange(task.id, !task.completed)} className={`px-2 rounded text-white text-xs font-semibold ${task.completed ? 'bg-green-600' : 'bg-red-600'}`}>
                    {task.completed? 'Completed' : 'Pending'}
                  </button>
        </p>
      </div>
      <div className='bg-stone-400 p-2 rounded-b-lg flex-1'>
        <p className="w-full line-clamp-5">{task.description}</p>
      </div>
    </div>
  );
}
