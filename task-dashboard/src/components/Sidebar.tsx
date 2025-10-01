import { Search, Plus, ChevronDown } from 'lucide-react';
import { type StateCheckbox } from '../types/StateCheckbox';
import { useState } from 'react';
import { type Category } from '../types/Category';
import { ActiveFilters } from './ActiveFilters';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (newTerm: string) => void;
}

interface FilterCheckboxProps {
    checkboxes: StateCheckbox[];
    onCheckboxChange: (id: string, checked: boolean) => void;
    completedTasksCount?: number;
    pendingTasksCount?: number;
}

interface CategoryProps{
    categories: Category[];
    selectedCategories: string[];
    onSelectedCategoriesChange: (categioriesIds: string[]) => void;
    categoryTaskCounts?: {id: string, count: number}[];
}

interface TaskFormProps{
    setIsFormOpen: (isOpen: boolean) => void;
}

interface SidebarProps extends SearchBarProps, FilterCheckboxProps, CategoryProps, TaskFormProps {}

export function Sidebar({
            searchTerm, onSearchChange, 
            checkboxes, onCheckboxChange, completedTasksCount, pendingTasksCount, 
            categories, onSelectedCategoriesChange, selectedCategories, categoryTaskCounts, 
            setIsFormOpen
}: SidebarProps) {

    const [isStateFilterOpen, setIsStateFilterOpen] =  useState(false);
    const [isCategoryFilterOpen, setIsCategoryFilterOpen] =  useState(false);

    function handleCategoryChange(categoryId: string){
        let updatedCategories: string[] = [];
        if(categories.find(cat => cat.id === categoryId)){
            if(!selectedCategories.find(catId => catId === categoryId)){
                updatedCategories = [...selectedCategories.map(catId => catId), categoryId];
            } else {
                updatedCategories = selectedCategories.filter(catId => catId !== categoryId);
            }
            onSelectedCategoriesChange(updatedCategories);
        }
    }

    const stateCheckboxes = checkboxes.map((checkbox) => (
                <label key={checkbox.id} className='flex items-center space-x-3 cursor-pointer'>
                    <input  type="checkbox" onChange={(e) => onCheckboxChange(checkbox.id,e.target.checked)} checked={checkbox.checked} 
                            className='form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500' 
                    />
                    <span className='text-white'>{checkbox.label}</span>
                    <span className='bg-slate-800 text-gray-300 px-2 py-0.5 rounded-full text-xs font-semibold'>
                        {checkbox.label === 'Completed'?completedTasksCount:pendingTasksCount}
                    </span>
                </label>
            ));
            
    const categoryCheckboxes = categories.map((category) => {
                const categoryCount = categoryTaskCounts?.find(c => c.id === category.id)?.count || 0;
                return (
                    <label key={category.id} className='flex items-center space-x-3 cursor-pointer'>
                        <input  type="checkbox" onChange={() => handleCategoryChange(category.id)} checked={selectedCategories.includes(category.id)} 
                                className='form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500' />
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ 
                                backgroundColor: category.color
                            }}
                        />
                        <span className='text-white'>{category.name}</span>
                        <span className='bg-slate-800 text-gray-300 px-2 py-0.5 rounded-full text-xs font-semibold'>
                            {categoryCount}
                        </span>
                    </label>
                );
    });

    return(
        <>
            <button 
                onClick={() => setIsFormOpen(true)} 
                className="w-full mb-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Task
            </button>
            <div className="w-full max-w-md mx-auto mb-6 relative">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-slate-500 bg-slate-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
            </div>
            <div className='mb-4'>
                <button onClick={() => setIsStateFilterOpen(!isStateFilterOpen)} 
                        className={`w-full px-4 py-2 border border-slate-500 bg-slate-600 text-white flex items-center justify-between hover:bg-slate-700 transition-colors
                            ${isStateFilterOpen ? 'rounded-t-lg' : 'rounded-lg'}
                        `}>
                    <span>Status Filter</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isStateFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {isStateFilterOpen && (
                    <div className="p-3 border border-t-0 border-slate-500 bg-slate-700 rounded-b-lg flex flex-col gap-2">
                        {stateCheckboxes}
                    </div>
                )}
            </div>
            <div className='mb-4'>
                <button onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)} 
                        className={`w-full px-4 py-2 border border-slate-500 bg-slate-600 text-white flex items-center justify-between hover:bg-slate-700 transition-colors
                            ${isCategoryFilterOpen ? 'rounded-t-lg' : 'rounded-lg'}
                        `}>
                    <span>Category Filter</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryFilterOpen && (
                    <div className="p-3 border border-t-0 border-slate-500 bg-slate-700 rounded-b-lg flex flex-col gap-2">
                        {categoryCheckboxes}
                    </div>
                )}
            </div>
        </>
    )
}