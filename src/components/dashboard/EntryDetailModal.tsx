import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Edit, X } from 'lucide-react';

import AISummary from './AISummary';
import MeetingsSection from './MeetingsSection';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import EntryCardHeader from './EntryCardHeader';
import { type Entry } from './EntryCard';

interface MoodColors {
  happy: string;
  productive: string;
  stressed: string;
  calm: string;
  excited: string;
  tired: string;
  [key: string]: string;
}

interface EntryDetailModalProps {
  entry: Entry;
  moodColors: MoodColors;
  open: boolean;
  onClose: () => void;
  onEdit: (entry: Entry) => void;
}

const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  moodColors,
  open,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex-1">
              <EntryCardHeader
                date={entry.date}
                mood={entry.mood}
                moodBadgeClassName={moodColors[entry.mood] || 'bg-gray-100 text-gray-800'}
                hideButtons={true}
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4 py-4 min-h-[300px]">
            {entry.summary ? (
              <AISummary summary={entry.summary} truncate={false} />
            ) : (
              <div className="text-gray-500 text-center p-4">No summary available</div>
            )}
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4 py-4 min-h-[300px]">
            {entry.meetings && entry.meetings.length > 0 ? (
              <MeetingsSection meetings={entry.meetings} truncate={false} />
            ) : (
              <div className="text-gray-500 text-center p-4">No meetings recorded</div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4 py-4 min-h-[300px]">
            {entry.tasks && entry.tasks.length > 0 ? (
              <TasksSection tasks={entry.tasks} truncate={false} />
            ) : (
              <div className="text-gray-500 text-center p-4">No tasks recorded</div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 py-4 min-h-[300px]">
            {entry.journalNotes ? (
              <NotesSection notes={entry.journalNotes} truncate={false} />
            ) : (
              <div className="text-gray-500 text-center p-4">No notes available</div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button onClick={() => onEdit(entry)} type='submit' variant="default">Edit Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntryDetailModal;