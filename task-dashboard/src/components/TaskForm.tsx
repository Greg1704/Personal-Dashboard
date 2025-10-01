import { useState } from 'react';
import {type Category} from '../types/Category';
import { type Task } from '../types/Task';
import { type TaskSubmitData } from '../types/TaskSubmitData';

interface TaskFormProps {
    mode: 'create' | 'edit';
    task?: Task; // Solo necesario en modo 'edit'
    onClose: () => void;
    onSubmit: (updatedTask: TaskSubmitData) => void;
    onDelete?: (taskId: string) => void;
    categories: Category[];
}

export function TaskForm({mode, task, onClose, onSubmit, onDelete, categories}: TaskFormProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [selectedCategoryId, setSelectedCategoryId] = useState(task?.categoryId || "");

    const isFormValid = title.trim() !== '';

    const isEditing = mode === 'edit' && task && onDelete;

    function handleTaskSubmit(e: React.FormEvent){
        e.preventDefault();
        onSubmit({
            id: task?.id,
            title,
            description,
            categoryId: selectedCategoryId
        });
        cancelForm();
    }


    function handleDelete(){
            onDelete!(task!.id);
            cancelForm();
    }

    function cancelForm(){
        onClose();
    }


    return(
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>
                {mode === 'create' ? 'Create a new Task' : 'Edit Task'}
            </h2>
            <form className="bg-slate-700 flex flex-col gap-2 p-3 w-11/12 rounded-lg" onSubmit={handleTaskSubmit}>
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
                <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Category</h3>
                <div className='flex items-center gap-2'>
                    <select 
                    value={selectedCategoryId} 
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-400 bg-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                    <option value="">Sin categoría</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    </select>
                    <div 
                        className="w-6 h-6 rounded-full border-2 border-slate-400" 
                        style={{ 
                            backgroundColor: selectedCategoryId 
                            ? categories.find(c => c.id === selectedCategoryId)?.color 
                            : 'transparent' 
                        }}
                    />
                </div>
                {!isEditing? (
                    <button type="submit" 
                        disabled={!isFormValid} 
                        className={`p-2 rounded font-semibold transition-colors ${
                            !isFormValid 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}>
                        Add Task
                    </button>
                ):(
                    <>
                        <button type="submit" 
                            disabled={!isFormValid} 
                            className={`p-2 rounded font-semibold transition-colors ${
                                !isFormValid 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}>
                            Edit Task
                        </button>
                        <button type="button"
                                onClick={handleDelete}
                            className="p-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold">
                            Delete Task
                        </button>
                    </>
                )}
                <button type="button" 
                        onClick={cancelForm}
                        className="p-2 rounded bg-slate-500 text-white hover:bg-slate-600 font-semibold">
                    Cancel
                </button>
            </form>
        </div>
    );
}