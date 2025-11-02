import { memo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
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

// Esquema de validación con Yup
const taskValidationSchema = yup.object({
    title: yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must be less than 100 characters')
        .trim(),
    description: yup.string()
        .max(500, 'Description must be less than 500 characters'),
    categoryId: yup.string()
        .required('Category is required')
});

function TaskFormComponent({mode, task, onClose, onSubmit, onDelete, categories}: TaskFormProps) {
    const isEditing = mode === 'edit' && task && onDelete;

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            title: task?.title || '',
            description: task?.description || '',
            categoryId: task?.categoryId || "0"
        },
        validationSchema: taskValidationSchema,
        onSubmit: (values) => {
            onSubmit({
                id: task?.id,
                title: values.title.trim(),
                description: values.description,
                categoryId: values.categoryId
            });
            onClose();
        }
    });

    function handleDelete(){
        onDelete!(task!.id);
    }

    return(
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>
                {mode === 'create' ? 'Create a new Task' : 'Edit Task'}
            </h2>
            <form className="bg-slate-700 flex flex-col gap-2 p-3 w-11/12 rounded-lg" onSubmit={formik.handleSubmit}>
                <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Title</h3>
                <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='Enter task title'
                    className={`px-2 py-1 border bg-slate-200 focus:outline-none focus:ring-2 rounded ${
                        formik.touched.title && formik.errors.title
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-400 focus:ring-indigo-500'
                    }`}
                />
                {formik.touched.title && formik.errors.title && (
                    <span className="text-red-400 text-sm ml-2 -mt-1">{formik.errors.title}</span>
                )}

                <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Description</h3>
                <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    placeholder='Enter task description, if you want...'
                    className={`px-2 py-1 mb-2 border bg-slate-200 focus:outline-none focus:ring-2 resize-none rounded ${
                        formik.touched.description && formik.errors.description
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-400 focus:ring-indigo-500'
                    }`}
                />
                {formik.touched.description && formik.errors.description && (
                    <span className="text-red-400 text-sm ml-2 -mt-1">{formik.errors.description}</span>
                )}

                <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Category</h3>
                <div className='flex items-center gap-2'>
                    <select
                        name="categoryId"
                        value={formik.values.categoryId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`flex-1 px-2 py-1 border bg-slate-200 rounded focus:outline-none focus:ring-2 ${
                            formik.touched.categoryId && formik.errors.categoryId
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-slate-400 focus:ring-indigo-500'
                        }`}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <div
                        className="w-6 h-6 rounded-full border-2 border-slate-400"
                        style={{
                            backgroundColor: formik.values.categoryId
                            ? categories.find(c => c.id === formik.values.categoryId)?.color
                            : 'transparent'
                        }}
                    />
                </div>
                {formik.touched.categoryId && formik.errors.categoryId && (
                    <span className="text-red-400 text-sm ml-2 -mt-1">{formik.errors.categoryId}</span>
                )}

                {!isEditing? (
                    <button type="submit"
                        disabled={!(formik.isValid && formik.dirty)}
                        className={`p-2 rounded font-semibold transition-colors ${
                            !(formik.isValid && formik.dirty)
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}>
                        Add Task
                    </button>
                ):(
                    <>
                        <button type="submit"
                            disabled={!formik.isValid}
                            className={`p-2 rounded font-semibold transition-colors ${
                                !formik.isValid
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}>
                            Edit Task
                        </button>
                        <button type="button"
                                onClick={handleDelete}
                            className="p-2 rounded transition-colors bg-red-600 text-white hover:bg-red-700 font-semibold">
                            Delete Task
                        </button>
                    </>
                )}
                <button type="button"
                        onClick={onClose}
                        className="p-2 rounded bg-slate-500 text-white hover:bg-slate-600 font-semibold">
                    Cancel
                </button>
            </form>
        </div>
    );
}

export const TaskForm = memo(TaskFormComponent);