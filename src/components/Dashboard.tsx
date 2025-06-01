/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import EntryModal from './EntryModal';
import EntryDetailModal from './dashboard/EntryDetailModal';
import DashboardHeader from './dashboard/DashboardHeader';
import EntryCard, { type Entry as EntryCardType } from './dashboard/EntryCard';
import NoEntries from './dashboard/NoEntries';
import AIChat from './AIChat'; // Import the AIChat component
import { dailyTaskService } from '@/lib/dailyTaskService';
import { useToast } from '../hooks/use-toast';
import Loader from './ui/loader';
import { Meeting, Task, Entry as EntryType, MoodColors } from '@/types';
import ConfirmationModal from './ui/confirmation-modal';

// Extend or redefine based on EntryCard's export
export interface Entry extends EntryCardType {
  date: string;
  meetings: Meeting[];
  tasks: Task[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'motivated' | 'stressed' | 'calm' | 'fun' | 'anxious' | 'grateful' | 'productive' | 'tired' | 'other';
  journalNotes: string;
  summary?: string;
}

const Dashboard = () => {
  const { toast } = useToast();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [isSaving, setIsSaving] = useState(false); // Add state for tracking entry saving
  
  // New state for detail modal
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // New state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Add state for tracking entry deletion

  useEffect(() => {
    const fetchTodaysData = async () => {
      setIsLoading(true); // Set isLoading to true before fetching
      const todday = new Date();
      todday.setDate(todday.getDate());
      const year = todday.getFullYear();
      const month = (todday.getMonth() + 1).toString().padStart(2, '0');
      const day = todday.getDate().toString().padStart(2, '0');
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
            summary: item.summary?.text || '', // Updated to use content instead of text
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

    fetchTodaysData();
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

  const handleSaveEntry = async (entryData: Omit<Entry, 'id' | 'summary' | 'createdAt' | 'updatedAt'>) => {
    setIsSaving(true); // Set isSaving to true when starting to save
    try {
      if (editingEntry) {
        // API call to update the entry
        const updatedEntry = await dailyTaskService.updateDailyTask(editingEntry.id, {
          date: entryData.date,
          meetings: entryData.meetings,
          tasks: entryData.tasks,
          mood: entryData.mood,
          journalNotes: entryData.journalNotes,
        });
        
        console.log('Entry updated:', updatedEntry.data);
        
        // Update the entry in state
        setEntries(entries.map(entry =>
          entry.id === editingEntry.id
            ? {
                ...entry,
                ...entryData,
                summary: updatedEntry.data.summary?.text || entry.summary || '', // Preserve summary if available
              }
            : entry
        ));
        
        toast({
          title: "Entry updated",
          description: "Your entry has been successfully updated.",
          variant: "success",
        });
      } else {
        console.log('Saving new entry:', entryData);
        
        const newEntry = await dailyTaskService.createDailyTask({
          date: entryData.date,
          meetings: entryData.meetings,
          tasks: entryData.tasks,
          mood: entryData.mood,
          journalNotes: entryData.journalNotes,
        });
        
        console.log('New entry created:', newEntry.data);
        
        setEntries([{
          id: newEntry.data._id, // Use _id from backend
          date: typeof newEntry.data.date === 'string' ? newEntry.data.date : new Date(newEntry.data.date).toISOString().split('T')[0],
          meetings: newEntry.data.meetings.map((m: any) => ({ title: m.title, time: m.time, notes: m.notes })),
          tasks: newEntry.data.tasks.map((t: any) => ({ caption: t.caption, url: t.url })),
          mood: newEntry.data.mood,
          journalNotes: newEntry.data.journalNotes,
          summary: newEntry.data.summary?.text || '', // Extract content if summary is an object
        }, ...entries]); // Add new entry to the beginning of the list
        
        toast({
          title: "Entry created",
          description: "Your entry has been successfully created.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your entry.",
        variant: "destructive",
      });
    } finally {
      setShowEntryModal(false);
      setEditingEntry(null);
      setIsSaving(false); // Reset isSaving state after saving
    }
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setShowEntryModal(true);
    // Close detail modal if it was open
    setShowDetailModal(false);
  };

  // Store entry ID to delete and show confirmation modal instead of deleting immediately
  const confirmDeleteEntry = (entryId: string) => {
    setEntryToDelete(entryId);
    setShowDeleteModal(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      // No need to set isDeleting here as it's now managed in handleConfirmDelete
      console.log('Deleting entry with ID:', entryId);
      await dailyTaskService.deleteDailyTask(entryId);
      
      // Update entries state by removing the deleted entry
      setEntries(entries.filter(entry => entry.id !== entryId));
      
      toast({
        title: "Entry deleted",
        description: "Your entry has been successfully deleted.",
        variant: "success",
      });
      
      return true; // Return success status
    } catch (error) {
      toast({
        title: "Error deleting entry",
        description: "There was a problem deleting your entry.",
        variant: "destructive",
      });
      console.error('Error deleting entry:', error);
      return false; // Return failure status
    }
  };
  
  // New function to handle confirm delete with proper async handling
  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    
    // Set loading state to true before starting delete
    setIsDeleting(true);
    
    try {
      const success = await handleDeleteEntry(entryToDelete);
      
      if (success) {
        // Only close the modal if deletion was successful
        setShowDeleteModal(false);
        setEntryToDelete(null);
      }
    } finally {
      // Always reset loading state when done, even if there was an error
      setIsDeleting(false);
    }
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
              onDelete={confirmDeleteEntry}
              onCardClick={handleCardClick}
            />
          ))}

          {entries.length === 0 && !isLoading && (
            <div className="col-span-1">
              <NoEntries onNewEntryClick={openNewEntryModal} />
            </div>
          )}
        </div>
      )}

      {/* Add AIChat component */}
      <AIChat />

      {showEntryModal && (
        <EntryModal
          entry={editingEntry}
          onSave={handleSaveEntry}
          onClose={() => {
            setShowEntryModal(false);
            setEditingEntry(null);
          }}
          isSaving={isSaving}
          isDateDisabled={true} // Allow date editing when opened from dashboard
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

      {/* Delete confirmation modal - Updated to use handleConfirmDelete */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteModal(false);
            setEntryToDelete(null);
          }
        }}
        title="Confirm Deletion"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
