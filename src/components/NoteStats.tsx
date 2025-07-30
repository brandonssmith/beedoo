import React from 'react';
import { NoteStatistics } from '../types/Note';
import { FileText, Tag, TrendingUp } from 'lucide-react';

interface NoteStatsProps {
  stats: NoteStatistics;
}

const NoteStats: React.FC<NoteStatsProps> = ({ stats }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Note Statistics</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-900">Total Notes</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalNotes}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-green-50 rounded-lg">
          <Tag className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-900">Unique Tags</p>
            <p className="text-2xl font-bold text-green-700">{stats.totalTags}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
          <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-purple-900">Avg Notes/Day</p>
            <p className="text-2xl font-bold text-purple-700">{stats.averageNotesPerDay}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteStats; 