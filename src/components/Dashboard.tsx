import { useState } from 'react';
import { Plus } from 'lucide-react';
import EntryModal from './EntryModal';
import DashboardHeader from './dashboard/DashboardHeader';
import EntryCard, { type Entry as EntryType } from './dashboard/EntryCard'; // Import Entry type
import NoEntries from './dashboard/NoEntries'; // Import NoEntries

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
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: '1',
      date: '2024-05-25',
      meetings: [
        { title: 'Client Presentation', time: '10:00 AM', notes: 'Discuss Q3 roadmap' },
        { title: 'Team Sync', time: '2:00 PM' }
      ],
      tasks: [
        { caption: 'Complete project proposal', url: 'https://docs.google.com/document/d/...' },
        { caption: 'Review code changes' }
      ],
      mood: 'productive',
      journalNotes: 'Great progress today. Feeling motivated about the upcoming project launch.',
      summary: 'A highly productive day focused on project advancement. You had two important meetings including a client presentation, completed key tasks, and maintained a positive outlook. Your notes indicate strong motivation for upcoming initiatives.'
    }
  ]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

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
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const openNewEntryModal = () => {
    setEditingEntry(null);
    setShowEntryModal(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:max-w-4xl">
      <DashboardHeader onNewEntryClick={openNewEntryModal} />

      <div className="space-y-4 md:space-y-6">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            moodColors={moodColors}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        ))}

        {entries.length === 0 && (
          <NoEntries onNewEntryClick={openNewEntryModal} />
        )}
      </div>

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
    </div>
  );
};

export default Dashboard;
