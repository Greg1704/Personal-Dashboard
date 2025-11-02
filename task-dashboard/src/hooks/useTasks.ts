import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import * as firestoreService from '../services/firestoreService';
import type { Task } from '../types/Task';
import toast from 'react-hot-toast';

// ========== QUERY: Fetch Tasks ==========

export function useTasks() {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: ['tasks', user?.uid],
    queryFn: () => firestoreService.fetchTasksByUser(user!.uid),
    enabled: !!user, // Solo ejecuta si hay usuario autenticado
    staleTime: 5 * 60 * 1000, // Datos frescos por 5 minutos
    retry: 2
  });
}

// ========== MUTATION: Add Task ==========

export function useAddTask() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (taskData: Omit<Task, 'id'>) =>
      firestoreService.createTask(user!.uid, taskData),

    // Optimistic update (actualización instantánea en UI)
    onMutate: async (newTask) => {
      // Cancela queries en progreso
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.uid] });

      // Guarda el estado anterior (para rollback)
      const previousTasks = queryClient.getQueryData(['tasks', user?.uid]);

      // Actualiza la caché optimísticamente
      queryClient.setQueryData(['tasks', user?.uid], (old: Task[] = []) => [
        ...old,
        { ...newTask, id: `temp-${Date.now()}` } // ID temporal
      ]);

      return { previousTasks }; // Contexto para rollback
    },

    // Si falla, revierte el cambio
    onError: (err, _newTask, context) => {
      queryClient.setQueryData(['tasks', user?.uid], context?.previousTasks);
      toast.error('Failed to add task');
      console.error('Error adding task:', err);
    },

    // Siempre refetch para sincronizar con servidor
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    },

    onSuccess: () => {
      toast.success('Task added successfully!');
    }
  });
}

// ========== MUTATION: Update Task ==========

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      firestoreService.updateTask(id, updates),

    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.uid] });
      const previousTasks = queryClient.getQueryData(['tasks', user?.uid]);

      queryClient.setQueryData(['tasks', user?.uid], (old: Task[] = []) =>
        old.map(task => task.id === id ? { ...task, ...updates } : task)
      );

      return { previousTasks };
    },

    onError: (err, _variables, context) => {
      queryClient.setQueryData(['tasks', user?.uid], context?.previousTasks);
      toast.error('Failed to update task');
      console.error('Error updating task:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    }
  });
}

// ========== MUTATION: Delete Task ==========

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (taskId: string) => firestoreService.deleteTask(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.uid] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', user?.uid]);

      // Guardar la tarea que se va a eliminar para el undo
      const deletedTask = previousTasks?.find(task => task.id === taskId);

      queryClient.setQueryData(['tasks', user?.uid], (old: Task[] = []) =>
        old.filter(task => task.id !== taskId)
      );

      return { previousTasks, deletedTask };
    },

    onError: (err, _taskId, context) => {
      queryClient.setQueryData(['tasks', user?.uid], context?.previousTasks);
      toast.error('Failed to delete task');
      console.error('Error deleting task:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.uid] });
    },

    onSuccess: () => {
      toast.success('Task deleted');
    }
  });
}

// ========== MUTATION: Toggle Task Status ==========

export function useToggleTaskStatus() {
  const updateTask = useUpdateTask();

  return {
    mutate: (task: Task) => {
      updateTask.mutate({
        id: task.id,
        updates: { completed: !task.completed }
      });
    },
    isLoading: updateTask.isPending
  };
}
