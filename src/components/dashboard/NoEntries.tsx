import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoEntriesProps {
  onNewEntryClick: () => void;
}

const NoEntries = ({ onNewEntryClick }: NoEntriesProps) => {
  return (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No entry found for Today</h3>
      <p className="text-gray-500 mb-4">Start your reflection journey by creating your daily entry</p>
      <Button
        onClick={onNewEntryClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Entry
      </Button>
    </div>
  );
};

export default NoEntries;
