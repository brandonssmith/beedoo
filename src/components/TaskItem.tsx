import React, { useState } from 'react';
import { Task } from '../types/Task';
import { formatTime } from '../utils/taskUtils';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit, Clock, CheckCircle, Circle } from 'lucide-react';
import TaskForm from './TaskForm';
import TimeInput from './TimeInput';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddSubtask: (parentId: string, subtask: Task) => void;
  onAddNextStep: (parentId: string, nextStep: Task) => void;
  level: number;
  showCompletedTasks: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
  onAddSubtask,
  onAddNextStep,
  level,
  showCompletedTasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(level <= 1); // Expand first two levels by default
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [showNextStepForm, setShowNextStepForm] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCompletedSubtasks, setShowCompletedSubtasks] = useState(true);

  // Filter subtasks and next steps based on visibility settings
  const visibleSubtasks = showCompletedSubtasks 
    ? task.subtasks 
    : task.subtasks.filter(subtask => !subtask.completed);
    
  const visibleNextSteps = showCompletedSubtasks 
    ? task.nextSteps 
    : task.nextSteps.filter(nextStep => !nextStep.completed);

  const hasChildren = visibleSubtasks.length > 0 || visibleNextSteps.length > 0;

  const handleToggleComplete = () => {
    onUpdateTask(task.id, { completed: !task.completed });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
    }
  };

  const handleAddSubtask = (subtask: Task) => {
    onAddSubtask(task.id, subtask);
    setShowSubtaskForm(false);
  };

  const handleAddNextStep = (nextStep: Task) => {
    onAddNextStep(task.id, nextStep);
    setShowNextStepForm(false);
  };

  const handleUpdateTime = (minutes: number) => {
    onUpdateTask(task.id, { actualTime: minutes });
    setShowTimeInput(false);
  };

  const getTaskTypeColor = () => {
    switch (task.type) {
      case 'main':
        return 'border-l-4 border-l-blue-500';
      case 'subtask':
        return 'border-l-4 border-l-green-500';
      case 'nextStep':
        return 'border-l-4 border-l-purple-500';
      default:
        return '';
    }
  };

  const getTaskTypeLabel = () => {
    switch (task.type) {
      case 'main':
        return 'Task';
      case 'subtask':
        return 'Subtask';
      case 'nextStep':
        return 'Next Step';
      default:
        return '';
    }
  };

  const getPriorityColors = () => {
    switch (task.priority) {
      case 'urgent':
        return { text: 'text-red-700', bg: 'bg-red-100' };
      case 'high':
        return { text: 'text-orange-700', bg: 'bg-orange-100' };
      case 'medium':
        return { text: 'text-yellow-700', bg: 'bg-yellow-100' };
      case 'low':
        return { text: 'text-green-700', bg: 'bg-green-100' };
      default:
        return { text: 'text-gray-700', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${getTaskTypeColor()}`} style={{ marginLeft: `${level * 8}px` }}>
      {/* Main Task Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 mt-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Complete Checkbox */}
                <button
                  onClick={handleToggleComplete}
                  className="flex-shrink-0 mt-1"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {getTaskTypeLabel()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColors().bg} ${getPriorityColors().text}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {/* Priority Order Indicator */}
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${getPriorityColors().bg} ${getPriorityColors().text}`}>
                      {task.priority === 'urgent' ? '1' : task.priority === 'high' ? '2' : task.priority === 'medium' ? '3' : '4'}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}

                  {/* Time Information */}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    {task.estimatedTime && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Est: {formatTime(task.estimatedTime)}
                      </span>
                    )}
                    {task.actualTime && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Actual: {formatTime(task.actualTime)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 ml-4">
                <button
                  onClick={() => setShowTimeInput(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Add actual time"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit task"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Subtask/Next Step Buttons */}
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowSubtaskForm(true)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Subtask
          </button>
          <button
            onClick={() => setShowNextStepForm(true)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded hover:bg-purple-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Next Step
          </button>
          {(task.subtasks.some(st => st.completed) || task.nextSteps.some(ns => ns.completed)) && (
            <button
              onClick={() => setShowCompletedSubtasks(!showCompletedSubtasks)}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                showCompletedSubtasks 
                  ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' 
                  : 'text-white bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {showCompletedSubtasks ? 'Hide Completed' : 'Show Completed'}
            </button>
          )}
        </div>
      </div>

      {/* Subtasks and Next Steps */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Subtasks */}
          {visibleSubtasks.length > 0 && (
            <div className="p-4 pt-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Subtasks ({visibleSubtasks.length}{!showCompletedSubtasks && task.subtasks.some(st => st.completed) && ` of ${task.subtasks.length}`})
              </h4>
              <div className="space-y-2 ml-4">
                {visibleSubtasks.map((subtask) => (
                  <TaskItem
                    key={subtask.id}
                    task={subtask}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onAddSubtask={onAddSubtask}
                    onAddNextStep={onAddNextStep}
                    level={level + 1}
                    showCompletedTasks={showCompletedTasks}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {visibleNextSteps.length > 0 && (
            <div className="p-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Next Steps ({visibleNextSteps.length}{!showCompletedSubtasks && task.nextSteps.some(ns => ns.completed) && ` of ${task.nextSteps.length}`})
              </h4>
              <div className="space-y-2 ml-4">
                {visibleNextSteps.map((nextStep) => (
                  <TaskItem
                    key={nextStep.id}
                    task={nextStep}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onAddSubtask={onAddSubtask}
                    onAddNextStep={onAddNextStep}
                    level={level + 1}
                    showCompletedTasks={showCompletedTasks}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showSubtaskForm && (
        <TaskForm
          onSubmit={handleAddSubtask}
          onCancel={() => setShowSubtaskForm(false)}
          taskType="subtask"
          parentId={task.id}
        />
      )}

      {showNextStepForm && (
        <TaskForm
          onSubmit={handleAddNextStep}
          onCancel={() => setShowNextStepForm(false)}
          taskType="nextStep"
          parentId={task.id}
        />
      )}

      {showEditForm && (
        <TaskForm
          onSubmit={(updatedTask) => {
            onUpdateTask(task.id, {
              title: updatedTask.title,
              description: updatedTask.description,
              estimatedTime: updatedTask.estimatedTime,
              priority: updatedTask.priority,
            });
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
          initialData={{
            title: task.title,
            description: task.description || '',
            estimatedTime: task.estimatedTime ? task.estimatedTime.toString() : '',
            priority: task.priority,
          }}
          isEditing={true}
        />
      )}

      {showTimeInput && (
        <TimeInput
          onSubmit={handleUpdateTime}
          onCancel={() => setShowTimeInput(false)}
          initialTime={task.actualTime}
        />
      )}
    </div>
  );
};

export default TaskItem; 