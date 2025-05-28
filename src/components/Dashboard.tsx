/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'; // Import useEffect
import { Plus } from 'lucide-react';
import EntryModal from './EntryModal';
import EntryDetailModal from './dashboard/EntryDetailModal'; // Import the new EntryDetailModal component
import DashboardHeader from './dashboard/DashboardHeader';
import EntryCard, { type Entry as EntryType } from './dashboard/EntryCard'; // Import Entry type
import NoEntries from './dashboard/NoEntries'; // Import NoEntries
import { dailyTaskService } from '@/lib/dailyTaskService'; // Import dailyTaskService
import { useToast } from '../hooks/use-toast';
import Loader from './ui/loader'; // Import Loader component

// Define the new Entry structure based on the schema
interface Meeting {
  title: string;
  time?: string;
  notes?: string;
}

interface Task {
  caption: string;
  url?: string;
}

// Updated Entry type to align with the Mongoose schema
export interface Entry extends EntryType { // Extend or redefine based on EntryCard's export
  date: string;
  meetings: Meeting[];
  tasks: Task[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'motivated' | 'stressed' | 'calm' | 'fun' | 'anxious' | 'grateful' | 'productive' | 'tired' | 'other';
  journalNotes: string;
  summary?: string; // Renamed from aiSummary, made optional
}

// Define MoodColors interface directly in Dashboard.tsx or import from a shared types file
interface MoodColors {
  happy: string;
  sad: string;
  neutral: string;
  excited: string;
  motivated: string;
  stressed: string;
  calm: string;
  fun: string;
  anxious: string;
  grateful: string;
  productive: string;
  tired: string;
  other: string;
  [key: string]: string; // Allow any string as a key, for flexibility if needed
}

const Dashboard = () => {
  const { toast } = useToast();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  
  // New state for detail modal
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchYesterdayTask = async () => {
      setIsLoading(true); // Set isLoading to true before fetching
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
      const day = yesterday.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      try {
        const response = await dailyTaskService.getTaskOfTheDay(formattedDate);
        console.log('Task of the day response:', response.data);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Map API response to Entry type if necessary
          const fetchedEntries = response.data.map((item: any) => ({
            id: item._id || item.id, // Use _id from backend, fallback to id
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : formattedDate,
            meetings: item.meetings?.map((m: any) => ({ title: m.title, time: m.time, notes: m.notes })) || [],
            tasks: item.tasks?.map((t: any) => ({ caption: t.caption, url: t.url })) || [],
            mood: item.mood || 'neutral',
            journalNotes: item.journalNotes || '',
            summary: item.summary?.text || '', // Assuming summary is an object with a text field
          }));
          setEntries(fetchedEntries); 
          
          console.log('Fetched entries for yesterday:', fetchedEntries);
        }
        else {
          setEntries([]); // Set to empty if no entries found
        }
      } catch (error) {
        console.error('Failed to fetch task of the day:', error);
        // Optionally, set entries to an empty array or show an error message
        setEntries([]); 
        toast({
          title: "Failed to fetch task",
          description: (error as Error).message, // Display error message
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Set isLoading to false after fetching
      }
    };

    fetchYesterdayTask();
  }, [toast]); // Empty dependency array ensures this runs only once on mount

  const moodColors: MoodColors = { // Ensure this object implements MoodColors
    happy: 'bg-yellow-100 text-yellow-800',
    sad: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
    excited: 'bg-purple-100 text-purple-800',
    motivated: 'bg-teal-100 text-teal-800',
    stressed: 'bg-red-100 text-red-800',
    calm: 'bg-sky-100 text-sky-800',
    fun: 'bg-pink-100 text-pink-800',
    anxious: 'bg-orange-100 text-orange-800',
    grateful: 'bg-lime-100 text-lime-800',
    productive: 'bg-green-100 text-green-800',
    tired: 'bg-slate-100 text-slate-800',
    other: 'bg-indigo-100 text-indigo-800',
  };

  const handleSaveEntry = (entryData: Omit<Entry, 'id' | 'summary' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      setEntries(entries.map(entry =>
        entry.id === editingEntry.id
          ? {
              ...editingEntry, // Preserve existing fields like id, summary
              ...entryData, // Apply new data
              // summary: 'Updated entry: AI analysis will be generated based on your latest inputs...' // Backend should handle summary generation
            }
          : entry
      ));
    } else {
      const newEntry: Entry = {
        ...entryData,
        id: Date.now().toString(),
        // summary: 'AI is analyzing your entry and will provide insights...' // Backend should handle summary generation
      };
      setEntries([newEntry, ...entries]);
    }
    setShowEntryModal(false);
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setShowEntryModal(true);
    // Close detail modal if it was open
    setShowDetailModal(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const openNewEntryModal = () => {
    setEditingEntry(null);
    setShowEntryModal(true);
  };

  // New handler for card click
  const handleCardClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:p-4 md:p-6 lg:max-w-4xl">
      <DashboardHeader 
        onNewEntryClick={openNewEntryModal} 
        hasEntries={entries.length > 0} 
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <Loader variant="dots" size="xl" text="Loading Todays Data" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              moodColors={moodColors}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
              onCardClick={handleCardClick} // Add the onCardClick handler
            />
          ))}

          {entries.length === 0 && !isLoading && (
            <div className="col-span-1">
              <NoEntries onNewEntryClick={openNewEntryModal} />
            </div>
          )}
        </div>
      )}

      {showEntryModal && (
        <EntryModal
          entry={editingEntry}
          onSave={handleSaveEntry}
          onClose={() => {
            setShowEntryModal(false);
            setEditingEntry(null);
          }}
        />
      )}

      {/* Add the EntryDetailModal */}
      {selectedEntry && showDetailModal && (
        <EntryDetailModal
          entry={selectedEntry}
          moodColors={moodColors}
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEditEntry}
        />
      )}
    </div>
  );
};

export default Dashboard;
