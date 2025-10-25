// src/services/storageService.ts
import { type Task } from '../types/Task';
import { type Category } from '../types/Category';
import { type StateCheckbox } from '../types/StateCheckbox';

const STORAGE_KEY = 'taskDashboard_';

export const storageService = {
  // Tasks
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(`${STORAGE_KEY}tasks`, JSON.stringify(tasks));
  },

  getTasks: (): Task[] | null => {
    const tasksStr = localStorage.getItem(`${STORAGE_KEY}tasks`);
    return tasksStr ? JSON.parse(tasksStr) : null;
  },

  // Categories
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(`${STORAGE_KEY}categories`, JSON.stringify(categories));
  },

  getCategories: (): Category[] | null => {
    const categoriesStr = localStorage.getItem(`${STORAGE_KEY}categories`);
    return categoriesStr ? JSON.parse(categoriesStr) : null;
  },

  // Filter checkboxes
  saveFilterCheckboxes: (checkboxes: StateCheckbox[]) => {
    localStorage.setItem(`${STORAGE_KEY}filterCheckboxes`, JSON.stringify(checkboxes));
  },

  getFilterCheckboxes: (): StateCheckbox[] | null => {
    const checkboxesStr = localStorage.getItem(`${STORAGE_KEY}filterCheckboxes`);
    return checkboxesStr ? JSON.parse(checkboxesStr) : null;
  },

  // Selected categories
  saveSelectedCategories: (categoryIds: string[]) => {
    localStorage.setItem(`${STORAGE_KEY}selectedCategories`, JSON.stringify(categoryIds));
  },

  getSelectedCategories: (): string[] | null => {
    const selectedStr = localStorage.getItem(`${STORAGE_KEY}selectedCategories`);
    return selectedStr ? JSON.parse(selectedStr) : null;
  },

  // Last deleted task (for undo functionality)
  saveLastDeletedTask: (task: Task) => {
    localStorage.setItem(`${STORAGE_KEY}lastDeletedTask`, JSON.stringify(task));
  },

  getLastDeletedTask: (): Task | null => {
    const taskStr = localStorage.getItem(`${STORAGE_KEY}lastDeletedTask`);
    return taskStr ? JSON.parse(taskStr) : null;
  },

  clearLastDeletedTask: () => {
    localStorage.removeItem(`${STORAGE_KEY}lastDeletedTask`);
  },

  // Clear all storage
  clearAll: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  }
};
