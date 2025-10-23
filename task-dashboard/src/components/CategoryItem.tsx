import { useState, useEffect } from 'react';
import { Pencil, Eraser, Check, X } from 'lucide-react';

interface CategoryItemProps {
    id: string;
    name: string;
    color: string;
    taskCount?: number;
    isEditing?: boolean;
    isNoCategory?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onSave?: (id: string, newName: string) => void;
    onCancel?: () => void;
}

export function CategoryItem({
    id,
    name, 
    color, 
    taskCount = 0,
    isEditing = false, 
    isNoCategory = false,
    onEdit, 
    onDelete, 
    onSave, 
    onCancel
}: CategoryItemProps) {

    // Estado local para el valor del input
    const [inputValue, setInputValue] = useState(name);

    // Sincronizar el input cuando cambie el prop 'name' (útil al entrar en modo edición)
    useEffect(() => {
        setInputValue(name);
    }, [name, isEditing]);

    function handleSave() {
        // Validar que no esté vacío
        const trimmedValue = inputValue.trim();
        if (trimmedValue === '') {
            // Podrías mostrar un error o simplemente no hacer nada
            return;
        }
        
        // Llamar a la función onSave con el nuevo nombre
        if (onSave && id) {
            onSave(id, trimmedValue);
        }
    }

    function handleCancel() {
        // Restaurar el valor original
        setInputValue(name);
        if (onCancel) {
            onCancel();
        }
    }

    function handleEdit() {
        if (onEdit && id) {
            onEdit(id);
        }
    }

    function handleDelete() {
        if (onDelete && id) {
            onDelete(id);
        }
    }

    // Handler para detectar Enter en el input
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }

    return (
        <div className="bg-slate-600 px-3 py-2 rounded-lg w-11/12 flex justify-between items-center text-sm text-white">
            <div className="gap-2 flex items-center flex-1">
                <div 
                    className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center" 
                    style={{ 
                        backgroundColor: color
                    }}
                >
                {!isEditing && taskCount !== undefined && (
                    <span className="text-white text-xs font-semibold leading-none">{taskCount}</span>
                )}
                </div>
                {isEditing ? 
                    <input  
                        type="text" 
                        placeholder={name}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="w-3/4 px-2 py-1 border border-slate-700 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    />
                :
                    <span className="w-3/4">{name}</span>
                }
            </div>
            <div className="gap-2 flex font-semibold">
                {isEditing ? 
                    <>
                        <button 
                            onClick={handleSave}
                            className="px-1.5 py-1 rounded transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            <Check className="w-4 h-4"/>
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="px-1.5 py-1 rounded transition-colors bg-slate-500 text-white hover:bg-slate-600"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </> 
                :
                    <>
                        <button 
                            onClick={handleEdit}
                            disabled={isNoCategory}
                            className={`px-1.5 py-1 rounded transition-colors ${
                                isNoCategory 
                                    ? 'bg-slate-500 text-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            <Pencil className="w-4 h-4"/>
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={isNoCategory}
                            className={`px-1.5 py-1 rounded transition-colors ${
                                isNoCategory 
                                    ? 'bg-slate-500 text-gray-400 cursor-not-allowed' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            <Eraser className="w-4 h-4"/>
                        </button>
                    </>
                }
            </div>
        </div>
    )
}