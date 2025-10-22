import { type Category } from '../types/Category';
import { useState } from 'react';
import { CategoryItem } from './CategoryItem';
import { Plus } from 'lucide-react';


interface CategoryManagerProps {
    categories: Category[];
    categoriesCount?:{id: string; count: number;}[];
    onClose: () => void;
    onAddCategory: (name: string, color: string) => void;
    onEditCategory: (id: string, newName: string) => void;
    onDeleteCategory: (id: string) => void;
    isClosing?: boolean;

}

export function CategoryManager({categories, categoriesCount, onClose, onAddCategory, onEditCategory, onDeleteCategory, isClosing}: CategoryManagerProps) {

    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryColor, setNewCategoryColor] = useState('#000000'); //! Modificar esto para que obtenga información de algun algun lado

    const categoriesList = //TODO: faltan props y funciones
    <>
    {categories.map(cat => {

        const isEditing = editingCategoryId === cat.id;

        <CategoryItem   key={cat.id} id={cat.id} name={cat.name} color={cat.color} taskCount={categoriesCount?.find(c => c.id === cat.id)?.count} 
                        isEditing={isEditing} isNoCategory={cat.id === "0"? true:false} onEdit={handleStartEditing} 
                        onDelete={handleDeleteCategory} onSave={handleSaveCategory} onCancel={handleCancelEditing}
        />
    })}
    {isCreating && (
        <CategoryItem
            id="new"
            name=""
            color={newCategoryColor}
            isEditing={true}
            onSave={handleSaveCategory}
            onCancel={handleCancelCreating}
        />
    )}
    </>
    function getNextAvailableColor(){}

    function handleStartEditing(categoryId: string) {}

    function handleCancelEditing() {}

    function handleSaveCategory(categoryId: string, newName: string) {} // Puede ser para editar o crear

    function handleStartCreating() {
        setIsCreating(true);
    }

    function handleCancelCreating() {}

    function handleDeleteCategory(categoryId: string) {}

    return (<>
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>
                Category Manager
            </h2>
            <div className="bg-slate-700 flex flex-col items-center gap-2 p-3 w-11/12 rounded-lg">
                {/*El boton no tiene funcionalidad asignada por el momento*/}
                <button className='flex items-center justify-center w-7/12 gap-2 p-2 mb-2 rounded font-semibold 
                                    transition-colors bg-indigo-600 text-white hover:bg-indigo-700'
                        onClick={handleStartCreating}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
                {categoriesList}
            </div>
        </div>
    </>)
}