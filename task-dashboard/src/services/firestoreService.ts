import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseService';
import type { Task } from '../types/Task';
import type { Category } from '../types/Category';

// ========== TASKS ==========

export async function fetchTasksByUser(userId: string): Promise<Task[]> {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description || '',
      completed: data.completed,
      categoryId: data.categoryId
    } as Task;
  });
}

export async function createTask(userId: string, taskData: Omit<Task, 'id'>): Promise<Task> {
  const tasksRef = collection(db, 'tasks');
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return { id: docRef.id, ...taskData };
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}

// ========== CATEGORIES ==========

export async function fetchCategoriesByUser(userId: string): Promise<Category[]> {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  const userCategories = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      color: data.color
    } as Category;
  });

  // Siempre incluir la categoría "No Category" con id "0"
  const noCategory: Category = {
    id: "0",
    name: "No Category",
    color: "#6b7280"
  };

  return [noCategory, ...userCategories];
}

export async function createCategory(userId: string, categoryData: Omit<Category, 'id'>): Promise<Category> {
  const categoriesRef = collection(db, 'categories');
  const docRef = await addDoc(categoriesRef, {
    ...categoryData,
    userId,
    createdAt: serverTimestamp()
  });

  return { id: docRef.id, ...categoryData };
}

export async function updateCategory(categoryId: string, updates: Partial<Omit<Category, 'id'>>): Promise<void> {
  const categoryRef = doc(db, 'categories', categoryId);
  await updateDoc(categoryRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const categoryRef = doc(db, 'categories', categoryId);
  await deleteDoc(categoryRef);
}
