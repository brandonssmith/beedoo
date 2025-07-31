import React from 'react';
import { TaskStatistics } from '../types/Task';
import { formatTime } from '../utils/taskUtils';
import { CheckCircle, TrendingUp } from 'lucide-react';

interface TaskStatsProps {
  stats: TaskStatistics;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const timeAccuracy = stats.totalActualTime > 0 && stats.totalEstimatedTime > 0
    ? Math.round((stats.totalActualTime / stats.totalEstimatedTime) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Task Statistics</h3>
      
      {/* Progress Overview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Task Counts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-lg font-semibold text-gray-900">{stats.completedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Tracking */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Time Tracking</h4>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estimated</span>
            <span className="text-sm font-medium text-gray-900">
              {formatTime(stats.totalEstimatedTime)}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Actual</span>
            <span className="text-sm font-medium text-gray-900">
              {formatTime(stats.totalActualTime)}
            </span>
          </div>
        </div>

        {stats.totalEstimatedTime > 0 && stats.totalActualTime > 0 && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className={`text-sm font-medium ${
                timeAccuracy >= 90 ? 'text-green-600' : 
                timeAccuracy >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {timeAccuracy}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-xs text-gray-500 text-center pt-2">
        {stats.completedTasks > 0 && (
          <p>
            {stats.completedTasks} of {stats.totalTasks} tasks completed
          </p>
        )}
        {stats.totalEstimatedTime > 0 && (
          <p>
            {formatTime(stats.totalEstimatedTime)} estimated time
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskStats; 