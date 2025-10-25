// src/services/categoryService.ts
import { type Category } from '../types/Category';

export const categoryService = {
  createCategory: (name: string, color: string): Category => {
    return {
      id: crypto.randomUUID(),
      name,
      color
    };
  },

  updateCategory: (categories: Category[], categoryId: string, newName: string): Category[] => {
    return categories.map(category =>
      category.id === categoryId ? { ...category, name: newName } : category
    );
  },

  deleteCategory: (categories: Category[], categoryId: string): Category[] => {
    return categories.filter(category => category.id !== categoryId);
  },

  findCategoryById: (categories: Category[], categoryId: string): Category | undefined => {
    return categories.find(category => category.id === categoryId);
  },

  categoryExists: (categories: Category[], categoryName: string): boolean => {
    return categories.some(category =>
      category.name.toLowerCase() === categoryName.toLowerCase()
    );
  }
};
