// src/services/taskService.ts
import { type Task } from '../types/Task';
import { type TaskSubmitData } from '../types/TaskSubmitData';

export const taskService = {
  createTask: (data: TaskSubmitData): Task => {
    return {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      completed: false,
      categoryId: data.categoryId
    };
  },

  updateTask: (tasks: Task[], taskData: TaskSubmitData): Task[] => {
    return tasks.map(task =>
      task.id === taskData.id
        ? { ...task, title: taskData.title, description: taskData.description, categoryId: taskData.categoryId }
        : task
    );
  },

  toggleTaskStatus: (tasks: Task[], taskId: string): Task[] => {
    return tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  },

  setTaskStatus: (tasks: Task[], taskId: string, completed: boolean): Task[] => {
    return tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
  },

  deleteTask: (tasks: Task[], taskId: string): Task[] => {
    return tasks.filter(task => task.id !== taskId);
  },

  findTaskById: (tasks: Task[], taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  },

  getTasksByCategory: (tasks: Task[], categoryId: string): Task[] => {
    return tasks.filter(task => task.categoryId === categoryId);
  },

  removeCategoryFromTasks: (tasks: Task[], categoryId: string): Task[] => {
    return tasks.map(task =>
      task.categoryId === categoryId ? { ...task, categoryId: "0" } : task
    );
  }
};
