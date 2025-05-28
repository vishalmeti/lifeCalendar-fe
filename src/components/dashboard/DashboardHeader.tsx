import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onNewEntryClick: () => void;
  hasEntries?: boolean; // Add new prop to check if entries exist
}

const DashboardHeader = ({ onNewEntryClick, hasEntries = false }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 sticky top-0 left-0 right-0 px-4 py-4 md:py-6 bg-white w-full shadow-md rounded-b-lg z-30">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Daily Entries</h1>
        <p className="text-sm md:text-base text-gray-600">Track your daily activities and reflect on your journey</p>
      </div>
      <Button
        onClick={onNewEntryClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto"
        disabled={hasEntries} // Disable button when entries exist
      >
        <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        {hasEntries ? "Today's Entry" : "New Entry"}
      </Button>
    </div>
  );
};

export default DashboardHeader;
