import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Loader from './ui/loader';

interface Meeting {
  title: string;
  time: string; // No longer optional
  amPm?: 'AM' | 'PM';
  notes?: string;
}

interface Task {
  caption: string;
  url?: string;
}

interface Entry {
  id: string;
  date: string;
  meetings: Meeting[];
  tasks: Task[];
  mood: string; // Keep as string for Select component, validation happens on save
  journalNotes: string; // Renamed from notes
  summary?: string; // Renamed from aiSummary
}

interface EntryModalProps {
  entry?: Entry | null;
  onSave: (entry: Omit<Entry, 'id' | 'summary'>) => void;
  onClose: () => void;
  isSaving?: boolean; // Add a new prop to track saving state
  isDateDisabled?: boolean; // Add new prop to control if date field is disabled
  initialDate?: string; // Add new prop for setting initial date when opened from calendar
}

const EntryModal = ({ entry, onSave, onClose, isSaving, isDateDisabled = false, initialDate }: EntryModalProps) => {
  // Use initialDate if provided (from calendar), otherwise use today's date
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [meetings, setMeetings] = useState<Meeting[]>([{ title: '', time: '', amPm: 'AM', notes: '' }]);
  const [tasks, setTasks] = useState<Task[]>([{ caption: '', url: '' }]);
  const [mood, setMood] = useState('');
  const [journalNotes, setJournalNotes] = useState(''); // Renamed from notes

  const moods = [
    'happy', 'sad', 'neutral', 'excited', 'motivated', 'stressed', 'calm', 'fun',
    'anxious', 'grateful', 'productive', 'tired', 'other'
  ];

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setMeetings(entry.meetings.length > 0 ? 
        entry.meetings.map(m => ({ ...m, amPm: m.amPm || 'AM' })) : 
        [{ title: '', time: '', amPm: 'AM', notes: '' }]);
      setTasks(entry.tasks.length > 0 ? entry.tasks : [{ caption: '', url: '' }]);
      setMood(entry.mood);
      setJournalNotes(entry.journalNotes); // Renamed from entry.notes
    } else {
      // Reset to default for new entry - use initialDate if provided
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setMeetings([{ title: '', time: '', amPm: 'AM', notes: '' }]);
      setTasks([{ caption: '', url: '' }]);
      setMood('');
      setJournalNotes('');
    }
  }, [entry, initialDate]);

  const addMeeting = () => {
    setMeetings([...meetings, { title: '', time: '', amPm: 'AM', notes: '' }]);
  };

  const removeMeeting = (index: number) => {
    setMeetings(meetings.filter((_, i) => i !== index));
  };

  const updateMeeting = (index: number, field: keyof Meeting, value: string | 'AM' | 'PM') => {
    const updated = [...meetings];
    updated[index] = { ...updated[index], [field]: value };
    setMeetings(updated);
  };

  const addTask = () => {
    setTasks([...tasks, { caption: '', url: '' }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: 'caption' | 'url', value: string) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    setTasks(updated);
  };

  // Helper function to render required field indicator - now empty since nothing is required
  const requiredStar = () => <></>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // No validation needed - submit all data as is
    onSave({
      date,
      meetings, // No filtering for valid meetings
      tasks,    // No filtering for valid tasks
      mood,
      journalNotes
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {entry ? 'Edit Entry' : 'New Daily Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isDateDisabled} // Disable date input if prop is true
            />
          </div>

          {/* Meetings */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Meetings
              </label>
              <Button type="button" onClick={addMeeting} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Meeting
              </Button>
            </div>
            <div className="space-y-3">
              {meetings.map((meeting, index) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Meeting title"
                      value={meeting.title}
                      onChange={(e) => updateMeeting(index, 'title', e.target.value)}
                    />
                    {meetings.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeMeeting(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                      <Input
                        placeholder="Time (e.g., 10:00)"
                        value={meeting.time}
                        onChange={(e) => updateMeeting(index, 'time', e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Select 
                        value={meeting.amPm || 'AM'} 
                        onValueChange={(value) => updateMeeting(index, 'amPm', value as 'AM' | 'PM')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Notes (optional)"
                    value={meeting.notes || ''}
                    onChange={(e) => updateMeeting(index, 'notes', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Tasks
              </label>
              <Button type="button" onClick={addTask} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Textarea
                      placeholder="Task description"
                      value={task.caption}
                      onChange={(e) => updateTask(index, 'caption', e.target.value)}
                      rows={8}
                    />
                    {tasks.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTask(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="URL (optional)"
                    value={task.url || ''}
                    onChange={(e) => updateTask(index, 'url', e.target.value)}
                    type="url"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood
            </label>
            <Select 
              value={mood} 
              onValueChange={setMood}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Journal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Journal Notes</label>
            <Textarea
              placeholder="Write your thoughts, reflections, or anything noteworthy about your day..."
              value={journalNotes}
              onChange={(e) => setJournalNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSaving} // Disable button when saving
            >
              {isSaving ? <Loader size="sm" /> : (entry ? 'Update Entry' : 'Save Entry')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;
