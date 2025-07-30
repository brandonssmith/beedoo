import { Task, TaskFormData, TimeInput, TaskStatistics, TaskPriority } from '../types/Task';

// Priority order for sorting (highest to lowest)
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1
};

// Sort tasks by priority (recursive function for nested structure)
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return tasks
    .map(task => ({
      ...task,
      subtasks: sortTasksByPriority(task.subtasks || []),
      nextSteps: sortTasksByPriority(task.nextSteps || [])
    }))
    .sort((a, b) => {
      // First, sort by completion status (active tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then sort by priority (highest first)
      const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const parseTimeInput = (timeInput: TimeInput): number => {
  const hours = parseInt(timeInput.hours) || 0;
  const minutes = parseInt(timeInput.minutes) || 0;
  return hours * 60 + minutes;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

export const createTask = (formData: TaskFormData, type: Task['type'], parentId?: string): Task => {
  const now = new Date();
  return {
    id: generateId(),
    title: formData.title,
    description: formData.description,
    estimatedTime: formData.estimatedTime ? parseTimeInput({ hours: '0', minutes: formData.estimatedTime }) : undefined,
    actualTime: undefined,
    completed: false,
    priority: formData.priority,
    subtasks: [],
    nextSteps: [],
    createdAt: now,
    updatedAt: now,
    parentId,
    type,
  };
};

export const findTaskById = (tasks: Task[], id: string): Task | null => {
  for (const task of tasks) {
    if (task.id === id) return task;
    
    const foundInSubtasks = findTaskById(task.subtasks, id);
    if (foundInSubtasks) return foundInSubtasks;
    
    const foundInNextSteps = findTaskById(task.nextSteps, id);
    if (foundInNextSteps) return foundInNextSteps;
  }
  return null;
};

export const updateTask = (tasks: Task[], id: string, updates: Partial<Task>): Task[] => {
  return tasks.map(task => {
    if (task.id === id) {
      return { ...task, ...updates, updatedAt: new Date() };
    }
    
    return {
      ...task,
      subtasks: updateTask(task.subtasks, id, updates),
      nextSteps: updateTask(task.nextSteps, id, updates),
    };
  });
};

export const deleteTask = (tasks: Task[], id: string): Task[] => {
  return tasks.filter(task => {
    if (task.id === id) return false;
    
    task.subtasks = deleteTask(task.subtasks, id);
    task.nextSteps = deleteTask(task.nextSteps, id);
    return true;
  });
};

export const addSubtask = (tasks: Task[], parentId: string, subtask: Task): Task[] => {
  return tasks.map(task => {
    if (task.id === parentId) {
      return {
        ...task,
        subtasks: [...task.subtasks, subtask],
        updatedAt: new Date(),
      };
    }
    
    return {
      ...task,
      subtasks: addSubtask(task.subtasks, parentId, subtask),
      nextSteps: addSubtask(task.nextSteps, parentId, subtask),
    };
  });
};

export const addNextStep = (tasks: Task[], parentId: string, nextStep: Task): Task[] => {
  return tasks.map(task => {
    if (task.id === parentId) {
      return {
        ...task,
        nextSteps: [...task.nextSteps, nextStep],
        updatedAt: new Date(),
      };
    }
    
    return {
      ...task,
      subtasks: addNextStep(task.subtasks, parentId, nextStep),
      nextSteps: addNextStep(task.nextSteps, parentId, nextStep),
    };
  });
};

export const calculateTaskStats = (tasks: Task[]): TaskStatistics => {
  let totalTasks = 0;
  let completedTasks = 0;
  let totalEstimatedTime = 0;
  let totalActualTime = 0;

  const processTasks = (taskList: Task[]) => {
    taskList.forEach(task => {
      totalTasks++;
      if (task.completed) completedTasks++;
      if (task.estimatedTime) totalEstimatedTime += task.estimatedTime;
      if (task.actualTime) totalActualTime += task.actualTime;
      
      processTasks(task.subtasks);
      processTasks(task.nextSteps);
    });
  };

  processTasks(tasks);
  
  return {
    totalTasks,
    completedTasks,
    totalEstimatedTime,
    totalActualTime,
  };
};

export const saveTasksToLocalStorage = (tasks: Task[]): void => {
  localStorage.setItem('beedoo-tasks', JSON.stringify(tasks));
};

export const loadTasksFromLocalStorage = (): Task[] => {
  const stored = localStorage.getItem('beedoo-tasks');
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    const convertDates = (taskList: any[]): Task[] => {
      return taskList.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        subtasks: convertDates(task.subtasks),
        nextSteps: convertDates(task.nextSteps),
      }));
    };
    return convertDates(parsed);
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}; 