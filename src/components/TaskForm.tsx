import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskFormData, TaskPriority } from '../types/Task';
import { createTask } from '../utils/taskUtils';
import { X } from 'lucide-react';
import PrioritySelector from './PrioritySelector';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  taskType?: 'main' | 'subtask' | 'nextStep';
  parentId?: string;
  initialData?: Partial<TaskFormData>;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  taskType = 'main',
  parentId,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    estimatedTime: '',
    priority: 'medium',
  });

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        estimatedTime: initialData.estimatedTime || '',
        priority: initialData.priority || 'medium',
      });
    }
  }, [initialData]);

  useEffect(() => {
    // Auto-focus the title input when form opens
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const newTask = createTask(formData, taskType, parentId);
    onSubmit(newTask);
  };

  const handleChange = (field: keyof TaskFormData, value: string | TaskPriority) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTaskTypeLabel = () => {
    switch (taskType) {
      case 'main':
        return 'Task';
      case 'subtask':
        return 'Subtask';
      case 'nextStep':
        return 'Next Step';
      default:
        return 'Task';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit' : 'Create'} {getTaskTypeLabel()}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter task description (optional)"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <PrioritySelector
                value={formData.priority}
                onChange={(priority) => handleChange('priority', priority)}
              />
            </div>

            {/* Estimated Time */}
            <div>
              <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                id="estimatedTime"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter estimated time in minutes"
                min="0"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 