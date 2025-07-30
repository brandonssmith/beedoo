import { Task } from '../types/Task';
import { Note } from '../types/Note';

export const exportTasksToFile = (tasks: Task[], filename?: string): void => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename || `beedoo-tasks-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const importTasksFromFile = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const tasks = JSON.parse(content);
        
        // Validate that it's an array of tasks
        if (!Array.isArray(tasks)) {
          throw new Error('File does not contain a valid task array');
        }
        
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
        
        const convertedTasks = convertDates(tasks);
        resolve(convertedTasks);
      } catch (error) {
        reject(new Error('Invalid file format. Please select a valid Beedoo task file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateTaskFile = (file: File): boolean => {
  const validExtensions = ['.json'];
  const fileName = file.name.toLowerCase();
  
  return validExtensions.some(ext => fileName.endsWith(ext));
};

// Note file utilities
export const exportNotesToFile = (notes: Note[], filename?: string): void => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename || `beedoo-notes-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const importNotesFromFile = (file: File): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const notes = JSON.parse(content);
        
        // Validate that it's an array of notes
        if (!Array.isArray(notes)) {
          throw new Error('File does not contain a valid note array');
        }
        
        // Convert date strings back to Date objects
        const convertDates = (noteList: any[]): Note[] => {
          return noteList.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
        };
        
        const convertedNotes = convertDates(notes);
        resolve(convertedNotes);
      } catch (error) {
        reject(new Error('Invalid file format. Please select a valid Beedoo note file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateNoteFile = (file: File): boolean => {
  const validExtensions = ['.json'];
  const fileName = file.name.toLowerCase();
  
  return validExtensions.some(ext => fileName.endsWith(ext));
}; 