import React from 'react';
import { TaskPriority } from '../types/Task';

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  className?: string;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange, className = '' }) => {
  const priorities: { value: TaskPriority; label: string; color: string; bgColor: string }[] = [
    { value: 'urgent', label: 'Urgent', color: 'text-red-700', bgColor: 'bg-red-100' },
    { value: 'high', label: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    { value: 'low', label: 'Low', color: 'text-green-700', bgColor: 'bg-green-100' },
  ];

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {priorities.map((priority) => (
        <button
          key={priority.value}
          type="button"
          onClick={() => onChange(priority.value)}
          className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
            value === priority.value
              ? `${priority.bgColor} ${priority.color} border-current`
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {priority.label}
        </button>
      ))}
    </div>
  );
};

export default PrioritySelector; 