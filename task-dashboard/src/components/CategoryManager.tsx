import { type Category } from '../types/Category';
import {categoryColors} from '../data/categoryColors'
import { useState, useEffect } from 'react';
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
    const [newCategoryColor, setNewCategoryColor] = useState(() => {
        if (categoryColors.length === 0) return '#000000';
        // elige el primer color no usado por las categorías (evita saltos por "No Category")
        const used = new Set(categories.map(c => c.color));
        const firstUnused = categoryColors.find(col => !used.has(col));
        return firstUnused ?? categoryColors[categories.length % categoryColors.length];
    });

    const canCreateMoreCategories = categories.length < categoryColors.length + 1;

    // mantener newCategoryColor en sync con el prop `categories`
    useEffect(() => {
        if (categoryColors.length === 0) {
            setNewCategoryColor('#000000');
            return;
        }
        const used = new Set(categories.map(c => c.color));
        const firstUnused = categoryColors.find(col => !used.has(col));
        setNewCategoryColor(firstUnused ?? categoryColors[categories.length % categoryColors.length]);
    }, [categories]);

    const categoriesList =
    <>
    {categories.map(cat => {

        const isEditing = editingCategoryId === cat.id;

        return (<CategoryItem   key={cat.id} id={cat.id} name={cat.name} color={cat.color} taskCount={categoriesCount?.find(c => c.id === cat.id)?.count} 
                                isEditing={isEditing} isNoCategory={cat.id === "0"? true:false} onEdit={handleStartEditing} 
                                onDelete={handleDeleteCategory} onSave={handleSaveCategory} onCancel={handleCancelEditing}
        />)
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

    function handleStartEditing(categoryId: string) {
        setEditingCategoryId(categoryId);
    }

    function handleCancelEditing() {
        setEditingCategoryId(null);
    }

    function handleSaveCategory(categoryId: string, newName: string) {
        if (categoryId === "new") {
            onAddCategory(newName, newCategoryColor);
            setIsCreating(false);
            // quitar setNewCategoryColor aquí — useEffect actualizará después del re-render del padre
        } else {
            onEditCategory(categoryId, newName);
            setEditingCategoryId(null);
        }
    }

    function handleStartCreating() {
        setIsCreating(true);
    }

    function handleCancelCreating() {
        setIsCreating(false);
    }

    function handleDeleteCategory(categoryId: string) {
        onDeleteCategory(categoryId);
        // quitar setNewCategoryColor aquí — useEffect actualizará con el nuevo `categories`
    }

    return (<>
        <div className='items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-200 mb-2'>
                Category Manager
            </h2>
            <div className="bg-slate-700 flex flex-col items-center gap-2 p-3 w-11/12 rounded-lg">
                {/*El boton no tiene funcionalidad asignada por el momento*/}
                { canCreateMoreCategories &&
                <button className='flex items-center justify-center w-7/12 gap-2 p-2 mb-2 rounded font-semibold 
                                    transition-colors bg-indigo-600 text-white hover:bg-indigo-700'
                        onClick={handleStartCreating}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
                }
                {categoriesList}
                <button className='flex items-center justify-center w-7/12 gap-2 p-2 mt-2 mb-2 rounded font-semibold 
                                    transition-colors bg-slate-500 text-white hover:bg-slate-600'
                        onClick={onClose}
                >
                    <span>Close</span>
                </button>
            </div>
        </div>
    </>)
}