import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TimeInputProps {
  onSubmit: (minutes: number) => void;
  onCancel: () => void;
  initialTime?: number;
}

const TimeInput: React.FC<TimeInputProps> = ({
  onSubmit,
  onCancel,
  initialTime,
}) => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');

  useEffect(() => {
    if (initialTime) {
      const h = Math.floor(initialTime / 60);
      const m = initialTime % 60;
      setHours(h.toString());
      setMinutes(m.toString());
    }
  }, [initialTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    onSubmit(totalMinutes);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Enter Actual Time
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
            <div className="flex items-center space-x-4">
              {/* Hours */}
              <div className="flex-1">
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  id="hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  max="999"
                />
              </div>

              {/* Minutes */}
              <div className="flex-1">
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Minutes
                </label>
                <input
                  type="number"
                  id="minutes"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  max="59"
                />
              </div>
            </div>

            {/* Total Time Display */}
            <div className="text-sm text-gray-600">
              Total: {parseInt(hours) * 60 + parseInt(minutes)} minutes
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimeInput; 