import React, { useState } from 'react';
import { Note } from '../types/Note';
import { Edit, Trash2, Tag, Calendar, Clock } from 'lucide-react';
import NoteForm from './NoteForm';
// No longer need LexicalViewer or RichTextDisplay

interface NoteItemProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onUpdateNote, onDeleteNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (updatedNote: Note) => {
    onUpdateNote(note.id, updatedNote);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div 
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                {note.title}
              </h3>
              
              {note.content && (
                <div className={`text-gray-600 mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              )}
            </div>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(note.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(note.updatedAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit note"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this note?')) {
                  onDeleteNote(note.id);
                }
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {note.content && note.content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {isEditing && (
        <NoteForm
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          initialData={note}
        />
      )}
    </>
  );
};

export default NoteItem; 