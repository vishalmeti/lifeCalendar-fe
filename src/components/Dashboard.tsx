
import { useState } from 'react';
import { Plus, Calendar, Clock, Smile, FileText, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import EntryModal from './EntryModal';
import { Badge } from './ui/badge';

interface Entry {
  id: string;
  date: string;
  meetings: string[];
  tasks: { caption: string; url?: string }[];
  mood: string;
  notes: string;
  aiSummary: string;
}

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Entries</h1>
          <p className="text-gray-600">Track your daily activities and reflect on your journey</p>
        </div>
        <Button
          onClick={() => setShowEntryModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <Badge className={moodColors[entry.mood as keyof typeof moodColors]}>
                    <Smile className="w-3 h-3 mr-1" />
                    {entry.mood}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEntry(entry)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* AI Summary - Prominent Display */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-l-indigo-400">
                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  AI Summary
                </h3>
                <p className="text-indigo-800 leading-relaxed">{entry.aiSummary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Meetings */}
                {entry.meetings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Meetings
                    </h3>
                    <ul className="space-y-2">
                      {entry.meetings.map((meeting, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-lg">
                          {meeting}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {entry.tasks.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Tasks
                    </h3>
                    <ul className="space-y-2">
                      {entry.tasks.map((task, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>{task.caption}</span>
                            {task.url && (
                              <a
                                href={task.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-700"
                              >
                                <LinkIcon className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Notes */}
              {entry.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Journal Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{entry.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
            <p className="text-gray-500 mb-4">Start your reflection journey by creating your first daily entry</p>
            <Button
              onClick={() => setShowEntryModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Entry
            </Button>
          </div>
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
