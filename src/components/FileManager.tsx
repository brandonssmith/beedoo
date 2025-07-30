import React, { useRef } from 'react';
import { Task } from '../types/Task';
import { Note } from '../types/Note';
import { exportTasksToFile, importTasksFromFile, validateTaskFile, exportNotesToFile, importNotesFromFile, validateNoteFile } from '../utils/fileUtils';
import { Download, Upload, AlertCircle } from 'lucide-react';

interface FileManagerProps {
  tasks: Task[];
  notes: Note[];
  onImportTasks: (tasks: Task[]) => void;
  onImportNotes: (notes: Note[]) => void;
  onClearAllTasks: () => void;
  onClearAllNotes: () => void;
  lastSaved?: Date | null;
}

const FileManager: React.FC<FileManagerProps> = ({ tasks, notes, onImportTasks, onImportNotes, onClearAllTasks, onClearAllNotes, lastSaved }) => {
  const taskFileInputRef = useRef<HTMLInputElement>(null);
  const noteFileInputRef = useRef<HTMLInputElement>(null);

  // Task Export
  const handleExportTasks = () => {
    if (tasks.length === 0) {
      alert('No tasks to export');
      return;
    }
    exportTasksToFile(tasks);
  };

  // Task Import
  const handleImportTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!validateTaskFile(file)) {
      alert('Please select a valid JSON file');
      return;
    }
    importTasksFromFile(file)
      .then((importedTasks) => {
        if (window.confirm(`Import ${importedTasks.length} tasks? This will replace your current tasks.`)) {
          onImportTasks(importedTasks);
        }
      })
      .catch((error) => {
        alert(`Import failed: ${error.message}`);
      })
      .finally(() => {
        if (taskFileInputRef.current) {
          taskFileInputRef.current.value = '';
        }
      });
  };

  // Note Export
  const handleExportNotes = () => {
    if (notes.length === 0) {
      alert('No notes to export');
      return;
    }
    exportNotesToFile(notes);
  };

  // Note Import
  const handleImportNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!validateNoteFile(file)) {
      alert('Please select a valid JSON file');
      return;
    }
    importNotesFromFile(file)
      .then((importedNotes) => {
        if (window.confirm(`Import ${importedNotes.length} notes? This will replace your current notes.`)) {
          onImportNotes(importedNotes);
        }
      })
      .catch((error) => {
        alert(`Import failed: ${error.message}`);
      })
      .finally(() => {
        if (noteFileInputRef.current) {
          noteFileInputRef.current.value = '';
        }
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
      <div className="space-y-3">
        {/* Export Tasks */}
        <button
          onClick={handleExportTasks}
          disabled={tasks.length === 0}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Tasks
        </button>
        {/* Import Tasks */}
        <button
          onClick={() => taskFileInputRef.current?.click()}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Tasks
        </button>
        <input
          ref={taskFileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportTasks}
          className="hidden"
        />
        {/* Clear All Tasks */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
              onClearAllTasks();
            }
          }}
          disabled={tasks.length === 0}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All Tasks
        </button>
        {/* Export Notes */}
        <button
          onClick={handleExportNotes}
          disabled={notes.length === 0}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Notes
        </button>
        {/* Import Notes */}
        <button
          onClick={() => noteFileInputRef.current?.click()}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Notes
        </button>
        <input
          ref={noteFileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportNotes}
          className="hidden"
        />
        {/* Clear All Notes */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
              onClearAllNotes();
            }
          }}
          disabled={notes.length === 0}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All Notes
        </button>
      </div>
      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Server Storage</p>
            <p className="mt-1">
              Your tasks and notes are automatically saved to the server and synced across all your devices. 
              Use Export/Import to backup your data or transfer between different accounts.
            </p>
            {lastSaved && (
              <p className="mt-2 text-xs text-blue-600">
                Last synced: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager; 