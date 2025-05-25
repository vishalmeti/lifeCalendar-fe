
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Task {
  caption: string;
  url?: string;
}

interface Entry {
  id: string;
  date: string;
  meetings: string[];
  tasks: Task[];
  mood: string;
  notes: string;
  aiSummary: string;
}

interface EntryModalProps {
  entry?: Entry | null;
  onSave: (entry: Omit<Entry, 'id' | 'aiSummary'>) => void;
  onClose: () => void;
}

const EntryModal = ({ entry, onSave, onClose }: EntryModalProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetings, setMeetings] = useState<string[]>(['']);
  const [tasks, setTasks] = useState<Task[]>([{ caption: '', url: '' }]);
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');

  const moods = ['happy', 'productive', 'stressed', 'calm', 'excited', 'tired'];

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setMeetings(entry.meetings.length > 0 ? entry.meetings : ['']);
      setTasks(entry.tasks.length > 0 ? entry.tasks : [{ caption: '', url: '' }]);
      setMood(entry.mood);
      setNotes(entry.notes);
    }
  }, [entry]);

  const addMeeting = () => {
    setMeetings([...meetings, '']);
  };

  const removeMeeting = (index: number) => {
    setMeetings(meetings.filter((_, i) => i !== index));
  };

  const updateMeeting = (index: number, value: string) => {
    const updated = [...meetings];
    updated[index] = value;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMeetings = meetings.filter(m => m.trim() !== '');
    const validTasks = tasks.filter(t => t.caption.trim() !== '');
    
    onSave({
      date,
      meetings: validMeetings,
      tasks: validTasks,
      mood,
      notes
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Meetings */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Meetings</label>
              <Button type="button" onClick={addMeeting} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {meetings.map((meeting, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Meeting title"
                    value={meeting}
                    onChange={(e) => updateMeeting(index, e.target.value)}
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
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Tasks</label>
              <Button type="button" onClick={addTask} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Task description"
                      value={task.caption}
                      onChange={(e) => updateTask(index, 'caption', e.target.value)}
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
                    value={task.url}
                    onChange={(e) => updateTask(index, 'url', e.target.value)}
                    type="url"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
            <Select value={mood} onValueChange={setMood} required>
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Journal Notes</label>
            <Textarea
              placeholder="Write your thoughts, reflections, or anything noteworthy about your day..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {entry ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;
