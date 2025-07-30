import { Note } from '../types/Note';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions/notes' 
  : 'http://localhost:8888/.netlify/functions/notes';

export class NoteService {
  static async loadNotes(): Promise<Note[]> {
    try {
      console.log('=== LOADING NOTES ===');
      console.log('API URL:', API_BASE_URL);
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Load response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to load notes: ${response.status} ${response.statusText}`);
      }

      const notes = await response.json();
      console.log('Raw notes from server:', notes);
      console.log('Notes count from server:', notes.length);
      
      // Convert date strings back to Date objects
      const convertDates = (noteList: any[]): Note[] => {
        return noteList.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
      };

      const convertedNotes = convertDates(notes);
      console.log('Converted notes:', convertedNotes);
      console.log('Converted notes count:', convertedNotes.length);
      
      return convertedNotes;
    } catch (error) {
      console.error('Error loading notes:', error);
      throw error;
    }
  }

  static async saveNotes(notes: Note[]): Promise<void> {
    try {
      console.log('=== SAVING NOTES ===');
      console.log('API URL:', API_BASE_URL);
      console.log('Notes to save:', notes);
      console.log('Notes count:', notes.length);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notes),
      });

      console.log('Save response status:', response.status, response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to save notes: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Notes saved successfully:', result);
    } catch (error) {
      console.error('Error saving notes:', error);
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