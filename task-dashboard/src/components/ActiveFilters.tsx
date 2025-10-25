import { useState, memo } from 'react';
import { type Category } from '../types/Category';
import {type StateCheckbox} from '../types/StateCheckbox';

interface ActiveFiltersProps{
    checkboxes: StateCheckbox[];
    onCheckboxChange: (id: string, checked: boolean) => void;
    categories: Category[];
    selectedCategories: string[];
    onCategoryChange: (categoryId: string) => void;
    onClearAll: () => void;
    filteredTasksCount: number;
    allTasksCount: number;
}

function ActiveFiltersComponent({checkboxes, onCheckboxChange, categories, selectedCategories, onCategoryChange, onClearAll, filteredTasksCount, allTasksCount}: ActiveFiltersProps) {
    
    const checkboxTags = checkboxes.filter(checkbox => checkbox.checked).map((checkbox) => (
        <span key={checkbox.id} className='bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center space-x-2  mr-2 mb-2'>
            <span>{checkbox.label}</span>
            <button onClick={() => onCheckboxChange(checkbox.id, false)} className='ml-1 text-white hover:text-gray-200'>&times;</button>
        </span>
    ));

    const activeCats = categories.filter(category => selectedCategories.includes(category.id));

    const categoryTags = activeCats.map((category) => (
        <span key={category.id} className='bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center space-x-2 mr-2 mb-2'>
            <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                    backgroundColor: category.color
                }}
            />
            <span>{category.name}</span>
            <button onClick={() => onCategoryChange(category.id)} className='ml-1 text-white hover:text-gray-200'>&times;</button>
        </span>
    ));

    return(
        <div className='p-2 bg-slate-600 rounded-lg mb-4'>
            <div className='flex justify-between items-center mb-2'>
                <h3 className='text-white font-semibold'>Active Filters</h3>
                <button onClick={onClearAll} className='text-sm text-indigo-200 hover:text-white'>Clear All</button>
            </div>
            <span className='text-white text-sm mb-2 block'>Showing {filteredTasksCount} of {allTasksCount} tasks</span>
            <div className='flex flex-row flex-wrap justify-start'>
                {checkboxTags}
                {categoryTags}
            </div>
        </div>
    )
}

export const ActiveFilters = memo(ActiveFiltersComponent);