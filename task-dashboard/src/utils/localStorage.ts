// src/utils/localStorage.ts
const STORAGE_KEY = 'taskDashboard_';

export const storage = {
    saveLastDeletedTask: (task: any) => {
        localStorage.setItem(`${STORAGE_KEY}lastDeletedTask`, JSON.stringify(task));
    },
    
    getLastDeletedTask: () => {
        const taskStr = localStorage.getItem(`${STORAGE_KEY}lastDeletedTask`);
        return taskStr ? JSON.parse(taskStr) : null;
    },
    
    clearLastDeletedTask: () => {
        localStorage.removeItem(`${STORAGE_KEY}lastDeletedTask`);
    }
};