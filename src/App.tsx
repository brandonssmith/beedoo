import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskPriority } from './types/Task';
import { Note } from './types/Note';
import { calculateTaskStats, sortTasksByPriority } from './utils/taskUtils';
import { TaskService } from './services/taskService';
import { NoteService } from './services/noteService';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import FileManager from './components/FileManager';
import { Plus, Menu, X, Wifi, WifiOff, Search, CheckSquare, FileText } from 'lucide-react';

function App() {
  // Mode state
  const [mode, setMode] = useState<'tasks' | 'notes'>('tasks');
  
  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskStats, setShowTaskStats] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  
  // Note state
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  
  // Shared state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataFromServer();
  }, []);

  const loadDataFromServer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load tasks first, then try to load notes
      const savedTasks = await TaskService.loadTasks();
      setTasks(savedTasks);
      
      try {
        console.log('Loading notes from server...');
        const savedNotes = await NoteService.loadNotes();
        console.log('Notes loaded from server:', savedNotes);
        console.log('Notes count loaded:', savedNotes.length);
        setNotes(savedNotes);
      } catch (notesError) {
        console.error('Failed to load notes:', notesError);
        setNotes([]); // Set empty notes array if loading fails
      }
      
      setLastSaved(new Date());
      setIsOnline(true);
    } catch (error) {
      console.error('Failed to load data from server:', error);
      setError('Failed to load data from server. Please check your connection.');
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasksToServer = useCallback(async () => {
    try {
      await TaskService.saveTasks(tasks);
      setLastSaved(new Date());
      setIsOnline(true);
      setError(null);
    } catch (error) {
      console.error('Failed to save tasks to server:', error);
      setError('Failed to save tasks to server. Your changes may not be saved.');
      setIsOnline(false);
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0 || lastSaved) { // Don't save on initial load
      saveTasksToServer();
    }
  }, [tasks, lastSaved, saveTasksToServer]);



  const saveNotesToServerWithNotes = async (notesToSave: Note[]) => {
    console.log('=== saveNotesToServerWithNotes called ===');
    console.log('Notes to save:', notesToSave);
    console.log('Notes count:', notesToSave.length);
    
    try {
      console.log('Calling NoteService.saveNotes with provided notes...');
      await NoteService.saveNotes(notesToSave);
      console.log('NoteService.saveNotes completed successfully');
      setLastSaved(new Date());
      setIsOnline(true);
      setError(null);
      console.log('Notes saved successfully to server');
    } catch (error) {
      console.error('Failed to save notes to server:', error);
      setError('Failed to save notes to server. Your changes may not be saved.');
      setIsOnline(false);
    }
  };



  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updateTaskRecursively = (taskList: Task[]): Task[] => {
        return taskList.map(task => {
          if (task.id === id) {
            return { ...task, ...updates, updatedAt: new Date() };
          }
          return {
            ...task,
            subtasks: updateTaskRecursively(task.subtasks),
            nextSteps: updateTaskRecursively(task.nextSteps),
          };
        });
      };
      return updateTaskRecursively(prev);
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => {
      const deleteTaskRecursively = (taskList: Task[]): Task[] => {
        return taskList.filter(task => {
          if (task.id === id) {
            return false;
          }
          task.subtasks = deleteTaskRecursively(task.subtasks);
          task.nextSteps = deleteTaskRecursively(task.nextSteps);
          return true;
        });
      };
      return deleteTaskRecursively(prev);
    });
  };

  const handleAddSubtask = (parentId: string, subtask: Task) => {
    setTasks(prev => {
      const addSubtaskRecursively = (taskList: Task[]): Task[] => {
        return taskList.map(task => {
          if (task.id === parentId) {
            return {
              ...task,
              subtasks: [...task.subtasks, subtask],
              updatedAt: new Date(),
            };
          }
          return {
            ...task,
            subtasks: addSubtaskRecursively(task.subtasks),
            nextSteps: addSubtaskRecursively(task.nextSteps),
          };
        });
      };
      return addSubtaskRecursively(prev);
    });
  };

  const handleAddNextStep = (parentId: string, nextStep: Task) => {
    setTasks(prev => {
      const addNextStepRecursively = (taskList: Task[]): Task[] => {
        return taskList.map(task => {
          if (task.id === parentId) {
            return {
              ...task,
              nextSteps: [...task.nextSteps, nextStep],
              updatedAt: new Date(),
            };
          }
          return {
            ...task,
            subtasks: addNextStepRecursively(task.subtasks),
            nextSteps: addNextStepRecursively(task.nextSteps),
          };
        });
      };
      return addNextStepRecursively(prev);
    });
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks);
  };

  const handleClearAllTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      setTasks([]);
      saveTasksToServer();
    }
  };

  // Note handlers
  const handleAddNote = (newNote: Note) => {
    console.log('=== handleAddNote called ===');
    console.log('New note:', newNote);
    
    setNotes(prev => {
      const updatedNotes = [...prev, newNote];
      console.log('Updated notes array:', updatedNotes);
      
      // Save notes immediately with the updated array
      setTimeout(() => {
        console.log('Saving notes with updated array...');
        saveNotesToServerWithNotes(updatedNotes);
      }, 100);
      
      return updatedNotes;
    });
    setShowNoteForm(false);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => {
      const updatedNotes = prev.map(note => 
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      );
      
      // Save notes immediately with the updated array
      setTimeout(() => {
        saveNotesToServerWithNotes(updatedNotes);
      }, 100);
      
      return updatedNotes;
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => {
      const updatedNotes = prev.filter(note => note.id !== id);
      
      // Save notes immediately with the updated array
      setTimeout(() => {
        saveNotesToServerWithNotes(updatedNotes);
      }, 100);
      
      return updatedNotes;
    });
  };

  const handleImportNotes = (importedNotes: Note[]) => {
    setNotes(importedNotes);
    saveNotesToServerWithNotes(importedNotes);
  };

  const handleClearAllNotes = () => {
    if (window.confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
      setNotes([]);
      saveNotesToServerWithNotes([]);
    }
  };

  // Search function to filter tasks by title and description
  const searchTasks = (taskList: Task[], query: string): Task[] => {
    if (!query.trim()) return taskList;
    
    const searchLower = query.toLowerCase();
    
    return taskList.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description?.toLowerCase().includes(searchLower) || false;
      
      // Check subtasks and next steps recursively
      const matchingSubtasks = searchTasks(task.subtasks, query);
      const matchingNextSteps = searchTasks(task.nextSteps, query);
      
      return matchesTitle || matchesDescription || matchingSubtasks.length > 0 || matchingNextSteps.length > 0;
    }).map(task => ({
      ...task,
      subtasks: searchTasks(task.subtasks, query),
      nextSteps: searchTasks(task.nextSteps, query),
    }));
  };

  // Search function to filter notes by title, content, and tags
  const searchNotes = (noteList: Note[], query: string): Note[] => {
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

  // Filter and sort tasks based on priority and search
  const filteredTasks = sortTasksByPriority(
    searchTasks(
      priorityFilter === 'all' 
        ? tasks 
        : tasks.filter(task => task.priority === priorityFilter),
      searchQuery
    )
  );

  // Filter notes based on search
  const filteredNotes = searchNotes(notes, searchQuery);

  const taskStats = calculateTaskStats(filteredTasks);

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-gray-900">{process.env.REACT_APP_NAME_VARIABLE || 'Beedoo'} Manager</h1>
              
              {/* Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMode('tasks')}
                  className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    mode === 'tasks'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 mr-1" />
                  Tasks
                </button>
                <button
                  onClick={() => setMode('notes')}
                  className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    mode === 'notes'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Notes
                </button>
              </div>
              
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={`Search ${mode}...`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  showCompletedTasks
                    ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    : 'text-white bg-gray-600 border-gray-600 hover:bg-gray-700'
                }`}
              >
                {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
              </button>
              <button
                onClick={() => setShowTaskStats(!showTaskStats)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Stats
              </button>
              <button
                onClick={() => mode === 'tasks' ? setShowTaskForm(true) : setShowNoteForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {mode === 'tasks' ? 'Task' : 'Note'}
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {/* Search Bar for Mobile */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder={`Search ${mode}...`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setShowCompletedTasks(!showCompletedTasks);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    showCompletedTasks
                      ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                      : 'text-white bg-gray-600 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
                </button>
                <button
                  onClick={() => {
                    setShowTaskStats(!showTaskStats);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Stats
                </button>
                <button
                  onClick={() => {
                    mode === 'tasks' ? setShowTaskForm(true) : setShowNoteForm(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {mode === 'tasks' ? 'Task' : 'Note'}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks from server...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <WifiOff className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <button
                    onClick={loadDataFromServer}
                    className="mt-2 text-red-800 underline hover:text-red-900"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Content List */}
            <div className="lg:col-span-3">
              {/* Search Results Indicator */}
              {searchQuery && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-700">
                        Search results for "{searchQuery}"
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Found {mode === 'tasks' ? filteredTasks.length : filteredNotes.length} {mode.slice(0, -1)}{mode === 'tasks' ? (filteredTasks.length !== 1 ? 's' : '') : (filteredNotes.length !== 1 ? 's' : '')}
                  </p>
                </div>
              )}
              
              {mode === 'tasks' ? (
                <TaskList
                  tasks={filteredTasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onAddSubtask={handleAddSubtask}
                  onAddNextStep={handleAddNextStep}
                  showCompletedTasks={showCompletedTasks}
                />
              ) : (
                <NoteList
                  notes={filteredNotes}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {mode === 'tasks' ? (
                <>
                  {showTaskStats && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <TaskStats stats={taskStats} />
                    </div>
                  )}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                        className={`w-full inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                          showCompletedTasks
                            ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            : 'text-white bg-gray-600 border-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {showCompletedTasks ? 'Hide Completed Tasks' : 'Show Completed Tasks'}
                      </button>
                      <button
                        onClick={() => setShowTaskForm(true)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                      </button>
                    </div>
                  </div>
                  {/* Priority Filter */}
                  <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Filter</h3>
                    <div className="space-y-2">
                      {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setPriorityFilter(priority)}
                          className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            priorityFilter === priority
                              ? 'bg-primary-100 text-primary-700 border border-primary-300'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowNoteForm(true)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </button>
                  </div>
                </div>
              )}
              {/* File Manager */}
              <FileManager
                tasks={tasks}
                notes={notes}
                onImportTasks={handleImportTasks}
                onImportNotes={handleImportNotes}
                onClearAllTasks={handleClearAllTasks}
                onClearAllNotes={handleClearAllNotes}
                lastSaved={lastSaved}
              />
            </div>
          </div>
        )}
      </main>
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
      
      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          onSubmit={handleAddNote}
          onCancel={() => setShowNoteForm(false)}
        />
      )}
    </>
  );
}

export default App; 