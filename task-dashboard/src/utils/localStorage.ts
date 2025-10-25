// src/utils/localStorage.ts
// DEPRECATED: Use storageService from services/storageService.ts instead
// This file is kept for backwards compatibility only

import { storageService } from '../services/storageService';

export const storage = {
    saveLastDeletedTask: storageService.saveLastDeletedTask,
    getLastDeletedTask: storageService.getLastDeletedTask,
    clearLastDeletedTask: storageService.clearLastDeletedTask
};