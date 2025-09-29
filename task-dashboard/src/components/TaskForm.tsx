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
        <div>
            <form className="bg-slate-700 flex flex-col" onSubmit={onSubmit}>
                <h2>Create a new Task</h2>
                <h3>Title</h3>
                <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className=""/>
                <h3>Description</h3>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className=""/>
                <button type="submit" 
                        disabled={!isFormValid} 
                        className={`p-2 rounded transition-colors ${
                            !isFormValid 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}>
                    Add Task
                </button>
                <button type="button" 
                        onClick={cancelForm}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600 mt-2">
                    Cancel
                </button>
            </form>
        </div>
    );
}