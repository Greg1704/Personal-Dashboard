import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import * as firestoreService from '../services/firestoreService';
import type { Category } from '../types/Category';
import toast from 'react-hot-toast';

// ========== QUERY: Fetch Categories ==========

export function useCategories() {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['categories', user?.uid],
    queryFn: () => firestoreService.fetchCategoriesByUser(user!.uid),
    enabled: !!user, // Solo ejecuta si hay usuario autenticado
    staleTime: 10 * 60 * 1000, // Datos frescos por 10 minutos (cambian menos que tasks)
    retry: 2
  });
}

// ========== MUTATION: Add Category ==========

export function useAddCategory() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (categoryData: Omit<Category, 'id'>) =>
      firestoreService.createCategory(user!.uid, categoryData),

    // Optimistic update
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ['categories', user?.uid] });
      const previousCategories = queryClient.getQueryData(['categories', user?.uid]);

      queryClient.setQueryData(['categories', user?.uid], (old: Category[] = []) => [
        ...old,
        { ...newCategory, id: `temp-${Date.now()}` }
      ]);

      return { previousCategories };
    },

    onError: (err, _newCategory, context) => {
      queryClient.setQueryData(['categories', user?.uid], context?.previousCategories);
      toast.error('Failed to add category');
      console.error('Error adding category:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.uid] });
    },

    onSuccess: () => {
      toast.success('Category added successfully!');
    }
  });
}

// ========== MUTATION: Update Category ==========

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Category, 'id'>> }) =>
      firestoreService.updateCategory(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['categories', user?.uid] });
      const previousCategories = queryClient.getQueryData(['categories', user?.uid]);

      queryClient.setQueryData(['categories', user?.uid], (old: Category[] = []) =>
        old.map(category => category.id === id ? { ...category, ...updates } : category)
      );

      return { previousCategories };
    },

    onError: (err, _variables, context) => {
      queryClient.setQueryData(['categories', user?.uid], context?.previousCategories);
      toast.error('Failed to update category');
      console.error('Error updating category:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.uid] });
    },

    onSuccess: () => {
      toast.success('Category updated successfully!');
    }
  });
}

// ========== MUTATION: Delete Category ==========

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (categoryId: string) => firestoreService.deleteCategory(categoryId),

    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ['categories', user?.uid] });
      const previousCategories = queryClient.getQueryData(['categories', user?.uid]);

      queryClient.setQueryData(['categories', user?.uid], (old: Category[] = []) =>
        old.filter(category => category.id !== categoryId)
      );

      return { previousCategories };
    },

    onError: (err, _categoryId, context) => {
      queryClient.setQueryData(['categories', user?.uid], context?.previousCategories);
      toast.error('Failed to delete category');
      console.error('Error deleting category:', err);
    },

    onSettled: () => {
      // Invalidar tanto categorías como tareas porque las tareas tienen categoryId
      queryClient.invalidateQueries({ queryKey: ['categories', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    },

    onSuccess: () => {
      toast.success('Category deleted');
    }
  });
}

// ========== HELPER: Find Category by ID ==========

export function useFindCategory(categoryId: string | undefined) {
  const { data: categories = [] } = useCategories();

  if (!categoryId) return categories.find(c => c.id === "0");
  return categories.find(c => c.id === categoryId);
}
