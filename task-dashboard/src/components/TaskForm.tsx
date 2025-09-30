import { useState } from 'react';

interface TaskFormProps {
    onClose: () => void;
    addTask: (title: string, description: string) => void;
}

export function TaskForm({onClose, addTask}: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const isFormValid = title.trim() !== '';

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        addTask(title, description);
        onClose();
        setTitle('');
        setDescription('');
    }

    function cancelForm(){
        onClose();
        setTitle('');
        setDescription('');
    }


    return(
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>Create a new Task</h2>
            <form className="bg-slate-700 flex flex-col gap-2 p-3 w-11/12 rounded-lg" onSubmit={onSubmit}>
                <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Title</h3>
                <input  type="text" value={title} onChange={(e)=>setTitle(e.target.value)} 
                        placeholder='Enter task title'
                        className="px-2 py-1 border border-slate-400 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                />
                <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Description</h3>
                <textarea   value={description} onChange={(e)=>setDescription(e.target.value)} 
                            rows={4}
                            placeholder='Enter task description, if you want...'
                            className="px-2 py-1 mb-2 border border-slate-400 bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none rounded"
                />
                <button type="submit" 
                        disabled={!isFormValid} 
                        className={`p-2 rounded font-semibold transition-colors ${
                            !isFormValid 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}>
                    Add Task
                </button>
                <button type="button" 
                        onClick={cancelForm}
                        className="p-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold">
                    Cancel
                </button>
            </form>
        </div>
    );
}