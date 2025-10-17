import { type Category } from '../types/Category';
import { useState } from 'react';
import { CategoryItem } from './CategoryItem';


interface CategoryManagerProps {
    categories: Category[];
}

export function CategoryManager({categories}: CategoryManagerProps) {

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
                <button className='w-7/12 p-2 mb-2 rounded font-semibold transition-colors bg-indigo-600 text-white hover:bg-indigo-700'>
                    Add Category
                </button>
                {categoriesList}
            </div>
        </div>
    </>)
}