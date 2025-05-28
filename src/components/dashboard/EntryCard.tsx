import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AISummary from './AISummary';
import MeetingsSection from './MeetingsSection';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import EntryCardHeader from './EntryCardHeader';

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

export interface Entry { // Exporting for Dashboard
  id: string;
  date: string;
  meetings: Meeting[];
  tasks: Task[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'motivated' | 'stressed' | 'calm' | 'fun' | 'anxious' | 'grateful' | 'productive' | 'tired' | 'other';
  journalNotes: string;
  summary?: string; // Renamed from aiSummary, made optional
}

interface MoodColors {
  happy: string;
  productive: string;
  stressed: string;
  calm: string;
  excited: string;
  tired: string;
  [key: string]: string; // Allow any string as a key
}

interface EntryCardProps {
  entry: Entry;
  moodColors: MoodColors;
  onEdit: (entry: Entry) => void;
  onDelete: (entryId: string) => void;
  onCardClick: (entry: Entry) => void; // Add new prop for card click
}

const EntryCard = ({ entry, moodColors, onEdit, onDelete, onCardClick }: EntryCardProps) => {
  return (
    <Card 
      key={entry.id} 
      className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onCardClick(entry)}
    >
      <CardHeader className="p-4 md:p-6"> {/* Adjusted padding */}
        <EntryCardHeader
          date={entry.date}
          mood={entry.mood}
          moodBadgeClassName={moodColors[entry.mood] || 'bg-gray-100 text-gray-800'}
          onEditClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            onEdit(entry);
          }}
          onDeleteClick={(e) => {
            e.stopPropagation(); // Prevent card click event
            onDelete(entry.id);
          }}
        />
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6"> {/* Adjusted padding and spacing */}
        <div className="overflow-hidden">
          <AISummary summary={entry.summary || ''} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"> {/* Adjusted gap and ensure single column on mobile */}
          <div className="overflow-hidden">
            <MeetingsSection meetings={entry.meetings} />
          </div>
          <div className="overflow-hidden">
            <TasksSection tasks={entry.tasks} />
          </div>
        </div>

        <div className="overflow-hidden">
          <NotesSection notes={entry.journalNotes} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EntryCard;

// Export Entry interface to be used in Dashboard.tsx
// export type { Entry }; // Already exported above
