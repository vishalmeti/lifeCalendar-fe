import { useState } from 'react';
import { Plus } from 'lucide-react';
import EntryModal from './EntryModal';
import DashboardHeader from './dashboard/DashboardHeader';
import EntryCard, { type Entry } from './dashboard/EntryCard'; // Import Entry type
import NoEntries from './dashboard/NoEntries';

const Dashboard = () => {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: '1',
      date: '2024-05-25',
      meetings: ['Team standup', 'Client presentation'],
      tasks: [
        { caption: 'Complete project proposal', url: 'https://docs.google.com/document/d/...' },
        { caption: 'Review code changes' }
      ],
      mood: 'productive',
      notes: 'Great progress today. Feeling motivated about the upcoming project launch.',
      aiSummary: 'A highly productive day focused on project advancement. You had two important meetings including a client presentation, completed key tasks, and maintained a positive outlook. Your notes indicate strong motivation for upcoming initiatives.'
    }
  ]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const moodColors = {
    happy: 'bg-yellow-100 text-yellow-800',
    productive: 'bg-green-100 text-green-800',
    stressed: 'bg-red-100 text-red-800',
    calm: 'bg-blue-100 text-blue-800',
    excited: 'bg-purple-100 text-purple-800',
    tired: 'bg-gray-100 text-gray-800',
  };

  const handleSaveEntry = (entryData: Omit<Entry, 'id' | 'aiSummary'>) => {
    if (editingEntry) {
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id 
          ? { 
              ...entryData, 
              id: editingEntry.id, 
              aiSummary: 'Updated entry: AI analysis will be generated based on your latest inputs...' 
            }
          : entry
      ));
    } else {
      const newEntry: Entry = {
        ...entryData,
        id: Date.now().toString(),
        aiSummary: 'AI is analyzing your entry and will provide insights about your day, patterns, and reflections...'
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
