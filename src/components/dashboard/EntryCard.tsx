import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AISummary from './AISummary';
import MeetingsSection from './MeetingsSection';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import EntryCardHeader from './EntryCardHeader'; // Import the new EntryCardHeader component

interface Entry {
  id: string;
  date: string;
  meetings: string[];
  tasks: { caption: string; url?: string }[];
  mood: string;
  notes: string;
  aiSummary: string;
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
}

const EntryCard = ({ entry, moodColors, onEdit, onDelete }: EntryCardProps) => {
  return (
    <Card key={entry.id} className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 md:p-6"> {/* Adjusted padding */}
        <EntryCardHeader 
          date={entry.date}
          mood={entry.mood}
          moodBadgeClassName={moodColors[entry.mood] || 'bg-gray-100 text-gray-800'}
          onEditClick={() => onEdit(entry)}
          onDeleteClick={() => onDelete(entry.id)}
        />
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6"> {/* Adjusted padding and spacing */}
        <AISummary summary={entry.aiSummary} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"> {/* Adjusted gap and ensure single column on mobile */}
          <MeetingsSection meetings={entry.meetings} />
          <TasksSection tasks={entry.tasks} />
        </div>

        <NotesSection notes={entry.notes} />
      </CardContent>
    </Card>
  );
};

export default EntryCard;

// Export Entry interface to be used in Dashboard.tsx
export type { Entry };
