// src/stores/useTaskStore.ts
import { create } from 'zustand';
import { type Task } from '../types/Task';
import { type TaskSubmitData } from '../types/TaskSubmitData';
import { taskService } from '../services/taskService';
import { storageService } from '../services/storageService';
import { tasks as initialTasks } from '../data/tasks';

interface TaskStore {
  tasks: Task[];
  lastDeletedTask: Task | null;

  // Actions
  addTask: (taskData: TaskSubmitData) => void;
  updateTask: (taskData: TaskSubmitData) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string, completed: boolean) => void;
  removeCategoryFromTasks: (categoryId: string) => void;
  restoreLastDeletedTask: () => void;
  clearLastDeletedTask: () => void;
  initializeTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: storageService.getTasks() || initialTasks,
  lastDeletedTask: storageService.getLastDeletedTask(),

  addTask: (taskData) => {
    const newTask = taskService.createTask(taskData);
    set(state => {
      const newTasks = [...state.tasks, newTask];
      storageService.saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  updateTask: (taskData) => {
    set(state => {
      const updatedTasks = taskService.updateTask(state.tasks, taskData);
      storageService.saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  deleteTask: (taskId) => {
    const taskToDelete = taskService.findTaskById(get().tasks, taskId);

    if (taskToDelete) {
      storageService.saveLastDeletedTask(taskToDelete);
      set({ lastDeletedTask: taskToDelete });
    }

    set(state => {
      const updatedTasks = taskService.deleteTask(state.tasks, taskId);
      storageService.saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  toggleTaskStatus: (taskId, completed) => {
    set(state => {
      const updatedTasks = taskService.setTaskStatus(state.tasks, taskId, completed);
      storageService.saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  removeCategoryFromTasks: (categoryId) => {
    set(state => {
      const updatedTasks = taskService.removeCategoryFromTasks(state.tasks, categoryId);
      storageService.saveTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  restoreLastDeletedTask: () => {
    const lastDeleted = get().lastDeletedTask;
    if (lastDeleted) {
      set(state => {
        const newTasks = [...state.tasks, lastDeleted];
        storageService.saveTasks(newTasks);
        storageService.clearLastDeletedTask();
        return { tasks: newTasks, lastDeletedTask: null };
      });
    }
  },

  clearLastDeletedTask: () => {
    storageService.clearLastDeletedTask();
    set({ lastDeletedTask: null });
  },

  initializeTasks: () => {
    const savedTasks = storageService.getTasks();
    if (savedTasks) {
      set({ tasks: savedTasks });
    }
  }
}));
