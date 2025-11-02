import { memo } from 'react';
import { Formik, Form, Field, ErrorMessage, type FieldProps } from 'formik';
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
        .max(100, 'Title must be less than 100 characters')
        .trim(),
    description: yup.string()
        .max(500, 'Description must be less than 500 characters'),
    categoryId: yup.string()
        .required('Category is required')
});

function TaskFormComponent({mode, task, onClose, onSubmit, onDelete, categories}: TaskFormProps) {
    const isEditing = mode === 'edit' && task && onDelete;

    function handleDelete(){
        onDelete!(task!.id);
    }

    return(
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>
                {mode === 'create' ? 'Create a new Task' : 'Edit Task'}
            </h2>

            <Formik
                initialValues={{
                    title: task?.title || '',
                    description: task?.description || '',
                    categoryId: task?.categoryId || "0"
                }}
                validationSchema={taskValidationSchema}
                onSubmit={(values) => {
                    onSubmit({
                        id: task?.id,
                        title: values.title.trim(),
                        description: values.description,
                        categoryId: values.categoryId
                    });
                    onClose();
                }}
            >
                {({ values, errors, touched, isValid, dirty }) => (
                    <Form className="bg-slate-700 flex flex-col gap-2 p-3 w-11/12 rounded-lg">
                        <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Title</h3>
                        <Field name="title">
                            {({ field }: FieldProps) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder='Enter task title'
                                    className={`px-2 py-1 border bg-slate-200 focus:outline-none focus:ring-2 rounded ${
                                        touched.title && errors.title
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-slate-400 focus:ring-indigo-500'
                                    }`}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="title" component="span" className="text-red-400 text-sm ml-2 -mt-1" />

                        <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Description</h3>
                        <Field name="description">
                            {({ field }: FieldProps) => (
                                <textarea
                                    {...field}
                                    rows={4}
                                    placeholder='Enter task description, if you want...'
                                    className={`px-2 py-1 mb-2 border bg-slate-200 focus:outline-none focus:ring-2 resize-none rounded ${
                                        touched.description && errors.description
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-slate-400 focus:ring-indigo-500'
                                    }`}
                                />
                            )}
                        </Field>
                        <ErrorMessage name="description" component="span" className="text-red-400 text-sm ml-2 -mt-1" />

                        <h3 className='text-2xl font-semibold text-gray-200 ml-2'>Category</h3>
                        <div className='flex items-center gap-2'>
                            <Field name="categoryId">
                                {({ field }: FieldProps) => (
                                    <select
                                        {...field}
                                        className={`flex-1 px-2 py-1 border bg-slate-200 rounded focus:outline-none focus:ring-2 ${
                                            touched.categoryId && errors.categoryId
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-slate-400 focus:ring-indigo-500'
                                        }`}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                )}
                            </Field>
                            <div
                                className="w-6 h-6 rounded-full border-2 border-slate-400"
                                style={{
                                    backgroundColor: values.categoryId
                                    ? categories.find(c => c.id === values.categoryId)?.color
                                    : 'transparent'
                                }}
                            />
                        </div>
                        <ErrorMessage name="categoryId" component="span" className="text-red-400 text-sm ml-2 -mt-1" />

                        {!isEditing? (
                            <button type="submit"
                                disabled={!(isValid && dirty)}
                                className={`p-2 rounded font-semibold transition-colors ${
                                    !(isValid && dirty)
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}>
                                Add Task
                            </button>
                        ):(
                            <>
                                <button type="submit"
                                    disabled={!isValid}
                                    className={`p-2 rounded font-semibold transition-colors ${
                                        !isValid
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
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export const TaskForm = memo(TaskFormComponent);
