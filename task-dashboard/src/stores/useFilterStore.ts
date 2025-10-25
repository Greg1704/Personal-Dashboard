// src/stores/useFilterStore.ts
import { create } from 'zustand';
import { type StateCheckbox } from '../types/StateCheckbox';
import { storageService } from '../services/storageService';
import { stateCheckboxes as initialCheckboxes } from '../data/stateCheckboxes';

interface FilterStore {
  searchTerm: string;
  filterCheckboxes: StateCheckbox[];
  selectedCategories: string[];

  // Actions
  setSearchTerm: (term: string) => void;
  toggleCheckbox: (checkboxId: string, checked: boolean) => void;
  clearAllCheckboxes: () => void;
  setSelectedCategories: (categoryIds: string[]) => void;
  toggleCategorySelection: (categoryId: string) => void;
  initializeFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  searchTerm: '',
  filterCheckboxes: storageService.getFilterCheckboxes() || initialCheckboxes,
  selectedCategories: storageService.getSelectedCategories() || [],

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  toggleCheckbox: (checkboxId, checked) => {
    set(state => {
      const updatedCheckboxes = state.filterCheckboxes.map(checkbox =>
        checkbox.id === checkboxId ? { ...checkbox, checked } : checkbox
      );
      storageService.saveFilterCheckboxes(updatedCheckboxes);
      return { filterCheckboxes: updatedCheckboxes };
    });
  },

  clearAllCheckboxes: () => {
    set(state => {
      const updatedCheckboxes = state.filterCheckboxes.map(checkbox => ({
        ...checkbox,
        checked: false
      }));
      storageService.saveFilterCheckboxes(updatedCheckboxes);
      return { filterCheckboxes: updatedCheckboxes };
    });
  },

  setSelectedCategories: (categoryIds) => {
    storageService.saveSelectedCategories(categoryIds);
    set({ selectedCategories: categoryIds });
  },

  toggleCategorySelection: (categoryId) => {
    set(state => {
      const isSelected = state.selectedCategories.includes(categoryId);
      const newSelection = isSelected
        ? state.selectedCategories.filter(id => id !== categoryId)
        : [...state.selectedCategories, categoryId];

      storageService.saveSelectedCategories(newSelection);
      return { selectedCategories: newSelection };
    });
  },

  initializeFilters: () => {
    const savedCheckboxes = storageService.getFilterCheckboxes();
    const savedCategories = storageService.getSelectedCategories();

    set({
      filterCheckboxes: savedCheckboxes || initialCheckboxes,
      selectedCategories: savedCategories || []
    });
  }
}));
