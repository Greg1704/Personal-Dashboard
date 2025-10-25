// src/hooks/useTaskAnimations.ts
import { useState, useEffect, useRef, useMemo } from 'react';
import { type Task } from '../types/Task';

export const useTaskAnimations = (filteredTasks: Task[], allTasks: Task[]) => {
  const [removingTasks, setRemovingTasks] = useState<Set<string>>(new Set());
  const [enteringTasks, setEnteringTasks] = useState<Set<string>>(new Set());
  const [exitingTasks, setExitingTasks] = useState<Set<string>>(new Set());
  const prevFilteredTasksRef = useRef<Task[]>([]);

  const { tasksToRenderWithAnimations, newEnteringTasks, newExitingTasks } = useMemo(() => {
    const prevIds = new Set(prevFilteredTasksRef.current.map(task => task.id));
    const currentIds = new Set(filteredTasks.map(task => task.id));

    const tasksExiting = prevFilteredTasksRef.current.filter(
      task => !currentIds.has(task.id) && !removingTasks.has(task.id)
    );

    const tasksEntering = filteredTasks.filter(
      task => !prevIds.has(task.id) && !removingTasks.has(task.id)
    );

    const tasksToRender = allTasks.filter(task =>
      currentIds.has(task.id) ||
      removingTasks.has(task.id) ||
      exitingTasks.has(task.id) ||
      tasksExiting.some(te => te.id === task.id)
    );

    return {
      tasksToRenderWithAnimations: tasksToRender,
      newEnteringTasks: tasksEntering,
      newExitingTasks: tasksExiting
    };
  }, [filteredTasks, allTasks, exitingTasks, removingTasks]);

  useEffect(() => {
    if (newExitingTasks.length > 0) {
      setExitingTasks(prev => {
        const newSet = new Set(prev);
        newExitingTasks.forEach(task => newSet.add(task.id));
        return newSet;
      });

      setTimeout(() => {
        setExitingTasks(prev => {
          const newSet = new Set(prev);
          newExitingTasks.forEach(task => newSet.delete(task.id));
          return newSet;
        });
      }, 500);
    }

    if (newEnteringTasks.length > 0) {
      setEnteringTasks(prev => {
        const newSet = new Set(prev);
        newEnteringTasks.forEach(task => newSet.add(task.id));
        return newSet;
      });

      setTimeout(() => {
        setEnteringTasks(prev => {
          const newSet = new Set(prev);
          newEnteringTasks.forEach(task => newSet.delete(task.id));
          return newSet;
        });
      }, 600);
    }

    prevFilteredTasksRef.current = filteredTasks;
  }, [filteredTasks, newExitingTasks, newEnteringTasks]);

  const addRemovingTask = (taskId: string) => {
    setRemovingTasks(prev => new Set(prev).add(taskId));
  };

  const removeRemovingTask = (taskId: string) => {
    setRemovingTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  const isTaskRemoving = (taskId: string) => removingTasks.has(taskId);
  const isTaskExiting = (taskId: string) =>
    exitingTasks.has(taskId) || newExitingTasks.some(te => te.id === taskId);
  const isTaskEntering = (taskId: string) =>
    enteringTasks.has(taskId) || newEnteringTasks.some(te => te.id === taskId);

  return {
    tasksToRenderWithAnimations,
    addRemovingTask,
    removeRemovingTask,
    isTaskRemoving,
    isTaskExiting,
    isTaskEntering
  };
};
