import { Task } from '../types/Task';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions/tasks' 
  : 'http://localhost:8888/.netlify/functions/tasks';

export class TaskService {
  static async loadTasks(): Promise<Task[]> {
    try {
      console.log('Attempting to load tasks from:', API_BASE_URL);
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to load tasks: ${response.status} ${response.statusText}`);
      }

      const tasks = await response.json();
      
      // Convert date strings back to Date objects
      const convertDates = (taskList: any[]): Task[] => {
        return taskList.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          subtasks: convertDates(task.subtasks || []),
          nextSteps: convertDates(task.nextSteps || []),
        }));
      };

      return convertDates(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      throw error;
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      console.log('Attempting to save tasks to:', API_BASE_URL);
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      });

      console.log('Save response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to save tasks: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Tasks saved successfully:', result);
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
} 