export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // for nested notes
  type: 'main' | 'child';
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string;
}

export interface NoteStatistics {
  totalNotes: number;
  totalTags: number;
  averageNotesPerDay: number;
} 