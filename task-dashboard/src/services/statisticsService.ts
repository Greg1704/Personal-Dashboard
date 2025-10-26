import {type Task} from '../types/Task';
import {type Category} from '../types/Category';

export interface TaskStatistics {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
}

export interface CategoryStatistics {
    id: string;
    name: string;
    color: string;
    total: number;
    completed: number;
    pending: number;
    percentage: number;
}

export const statisticsService = {

    getTaskStatistics: (tasks: Task[]): TaskStatistics => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : (completed / total) * 100;

        return { total, completed, pending, completionRate };
    },

    getCategoryStatistics: (tasks: Task[], categories: Category[]): CategoryStatistics[] => {
        return categories.map(category => {
            const categoryTasks = tasks.filter(task => task.categoryId === category.id);
            const total = categoryTasks.length;
            const completed = categoryTasks.filter(task => task.completed).length;
            const pending = total - completed;
            const percentage = tasks.length === 0 ? 0 : (total / tasks.length) * 100;
            return {
                id: category.id,
                name: category.name,
                color: category.color,
                total,
                completed,
                pending,
                percentage
            };
        });
    },

    getPieChartData: (categoryStats: CategoryStatistics[]) => {
        return categoryStats.map(stat => ({
            name: stat.name,
            value: stat.total,
            color: stat.color
        }));
    },

    getBarChartData: (categoryStats: CategoryStatistics[]) => {
        return categoryStats.map(stat => ({
            name: stat.name,
            completed: stat.completed,
            pending: stat.pending,
            color: stat.color
        }));
    }
};