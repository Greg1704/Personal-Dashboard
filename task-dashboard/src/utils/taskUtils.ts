// src/utils/taskUtils.ts
import { type Task } from '../types/Task';
import { type Category } from '../types/Category';

export const taskUtils = {
  // Count tasks by completion status
  countPendingTasks: (tasks: Task[]): number => {
    return tasks.filter(task => !task.completed).length;
  },

  countCompletedTasks: (tasks: Task[]): number => {
    return tasks.filter(task => task.completed).length;
  },

  // Count tasks by category
  countTasksByCategory: (tasks: Task[], categories: Category[]) => {
    return categories.map(category => ({
      id: category.id,
      count: tasks.filter(task => task.categoryId === category.id).length
    }));
  },

  // Filter tasks
  filterTasks: (
    tasks: Task[],
    searchTerm: string,
    activeCheckboxes: string[],
    selectedCategories: string[]
  ): Task[] => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        activeCheckboxes.length === 0 ||
        activeCheckboxes.includes(task.completed ? 'Completed' : 'Pending');

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        (task.categoryId && selectedCategories.includes(task.categoryId));

      return matchesSearch && matchesStatus && matchesCategory;
    });
  },

  // Get active checkbox labels
  getActiveCheckboxes: (checkboxes: { id: string; label: string; checked: boolean }[]): string[] => {
    return checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
  },

  // Sort tasks (can be extended with different sort options)
  sortTasks: (tasks: Task[], sortBy: 'title' | 'completed' | 'created' = 'created'): Task[] => {
    const sorted = [...tasks];

    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'completed':
        return sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
      default:
        return sorted;
    }
  }
};
