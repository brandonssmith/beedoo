import { Note, NoteStatistics } from '../types/Note';

export const calculateNoteStats = (notes: Note[]): NoteStatistics => {
  const totalNotes = notes.length;
  
  // Get all unique tags
  const allTags = new Set<string>();
  notes.forEach(note => {
    note.tags.forEach(tag => allTags.add(tag));
  });
  const totalTags = allTags.size;
  
  // Calculate average notes per day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentNotes = notes.filter(note => 
    new Date(note.createdAt) >= thirtyDaysAgo
  );
  
  const averageNotesPerDay = totalNotes > 0 ? (recentNotes.length / 30) : 0;
  
  return {
    totalNotes,
    totalTags,
    averageNotesPerDay: Math.round(averageNotesPerDay * 100) / 100
  };
};

export const searchNotes = (noteList: Note[], query: string): Note[] => {
  if (!query.trim()) return noteList;
  
  const searchLower = query.toLowerCase();
  
  return noteList.filter(note => {
    const matchesTitle = note.title.toLowerCase().includes(searchLower);
    const matchesContent = note.content.toLowerCase().includes(searchLower);
    const matchesTags = note.tags.some(tag => 
      tag.toLowerCase().includes(searchLower)
    );
    
    return matchesTitle || matchesContent || matchesTags;
  });
};

export const filterNotesByTag = (notes: Note[], tag: string): Note[] => {
  if (!tag || tag === 'all') return notes;
  
  return notes.filter(note => 
    note.tags.some(noteTag => 
      noteTag.toLowerCase() === tag.toLowerCase()
    )
  );
};

export const getAllTags = (notes: Note[]): string[] => {
  const allTags = new Set<string>();
  notes.forEach(note => {
    note.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}; 