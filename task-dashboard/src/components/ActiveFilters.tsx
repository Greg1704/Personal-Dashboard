import { useState } from 'react';
import { type Category } from '../types/Category';
import {type StateCheckbox} from '../types/StateCheckbox';

interface ActiveFiltersProps{
    checkboxes: StateCheckbox[];
    onCheckboxChange: (id: string, checked: boolean) => void;
    categories: Category[];
    onCategoryChange: (categoryId: string) => void;
    onClearAll: () => void;
}

export function ActiveFilters({checkboxes, onCheckboxChange, categories, onCategoryChange, onClearAll}: ActiveFiltersProps) {
    return(
        <div>
            <span>Nuevo componente</span>
        </div>
    )
}