import { type Category } from '../types/Category';
import { useState } from 'react';
import { CategoryItem } from './CategoryItem';
import { Plus } from 'lucide-react';


interface CategoryManagerProps {
    categories: Category[];
    categoriesCount:{id: string; count: number;}[];
    onClose: () => void;
    onAddCategory: (name: string, color: string) => void;
    onEditCategory: (id: string, newName: string) => void;
    onDeleteCategory: (id: string) => void;
    isClosing?: boolean;

}

export function CategoryManager({categories}: CategoryManagerProps) {

    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoyColor, setNewCategoryColor] = useState('#000000'); //! Modificar esto para que obtenga información de algun algun lado

    const categoriesList = categories.map(cat => (
        <CategoryItem key={cat.id} name={cat.name} color={cat.color} />
    ));

    return (<>
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>
                Category Manager
            </h2>
            <div className="bg-slate-700 flex flex-col items-center gap-2 p-3 w-11/12 rounded-lg">
                {/*El boton no tiene funcionalidad asignada por el momento*/}
                <button className='flex items-center justify-center w-7/12 gap-2 p-2 mb-2 rounded font-semibold 
                                    transition-colors bg-indigo-600 text-white hover:bg-indigo-700'
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
                {categoriesList}
            </div>
        </div>
    </>)
}