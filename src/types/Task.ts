export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  completed: boolean;
  priority: TaskPriority;
  subtasks: Task[];
  nextSteps: Task[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // for subtasks and next steps
  type: 'main' | 'subtask' | 'nextStep';
}

export interface TaskFormData {
  title: string;
  description: string;
  estimatedTime: string;
  priority: TaskPriority;
}

export interface TimeInput {
  hours: string;
  minutes: string;
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  totalEstimatedTime: number;
  totalActualTime: number;
} 