// src/stores/useCategoryStore.ts
import { create } from 'zustand';
import { type Category } from '../types/Category';
import { categoryService } from '../services/categoryService';
import { storageService } from '../services/storageService';
import { categories as initialCategories } from '../data/categories';

interface CategoryStore {
  categories: Category[];

  // Actions
  addCategory: (name: string, color: string) => void;
  updateCategory: (categoryId: string, newName: string) => void;
  deleteCategory: (categoryId: string) => void;
  findCategory: (categoryId: string) => Category | undefined;
  initializeCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: storageService.getCategories() || initialCategories,

  addCategory: (name, color) => {
    const newCategory = categoryService.createCategory(name, color);
    set(state => {
      const newCategories = [...state.categories, newCategory];
      storageService.saveCategories(newCategories);
      return { categories: newCategories };
    });
  },

  updateCategory: (categoryId, newName) => {
    set(state => {
      const updatedCategories = categoryService.updateCategory(state.categories, categoryId, newName);
      storageService.saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },

  deleteCategory: (categoryId) => {
    set(state => {
      const updatedCategories = categoryService.deleteCategory(state.categories, categoryId);
      storageService.saveCategories(updatedCategories);
      return { categories: updatedCategories };
    });
  },

  findCategory: (categoryId) => {
    return categoryService.findCategoryById(get().categories, categoryId);
  },

  initializeCategories: () => {
    const savedCategories = storageService.getCategories();
    if (savedCategories) {
      set({ categories: savedCategories });
    }
  }
}));
