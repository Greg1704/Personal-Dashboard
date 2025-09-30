import { Search, Plus } from 'lucide-react';
import { type StateCheckbox } from '../types/StateCheckbox';



interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (newTerm: string) => void;
}

interface FilterCheckboxProps {
    checkboxes: StateCheckbox[];
    onCheckboxChange: (id: string, checked: boolean) => void;
}

interface TaskFormProps{
    setIsFormOpen: (isOpen: boolean) => void;
}

interface SidebarProps extends SearchBarProps, FilterCheckboxProps, TaskFormProps {}

export function Sidebar({searchTerm, onSearchChange, checkboxes, onCheckboxChange, setIsFormOpen}: SidebarProps) {

    const stateCheckboxes = checkboxes.map((checkbox) => (
                <label key={checkbox.id} className='flex items-center space-x-3 cursor-pointer'>
                    <input type="checkbox" onChange={(e) => onCheckboxChange(checkbox.id,e.target.checked)} checked={checkbox.checked} className='form-checkbox h-5 w-5' />
                    <span className='text-white'>{checkbox.label}</span>
                </label>
            )); 

    return(
        <>
            <h1 className="text-2xl font-semibold text-white text-center p-3">Sidebar</h1>
            <button 
                onClick={() => setIsFormOpen(true)} 
                className="w-full mb-4 px-4 py-3 border-2 border-purple-500 
                        text-purple-200 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transition-all
                        flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Task
            </button>
            <h2 className="text-xl font-semibold text-white text-center p-3">Buscador de texto</h2>
            <div className="w-full max-w-md mx-auto mb-6 relative">
                <input
                    type="text"
                    placeholder="Buscar tareas..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" // Posicionar el ícono
                />
            </div>
            <h2 className="text-xl font-semibold text-white text-center p-3">Buscador de filtro por estado</h2>
            {stateCheckboxes}
            <h2 className="text-xl font-semibold text-white text-center p-3">Buscador de filtro de categoría</h2>
        </>
    )
}