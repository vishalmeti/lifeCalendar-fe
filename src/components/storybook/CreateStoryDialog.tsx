import { useState } from 'react';
import { BookMarked, Loader2, Sparkles, CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { Label } from '../ui/label';

interface CreateStoryDialogProps {
  isOpen: boolean;
  isGenerating: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (storyData: StoryGeneratePayload) => void;
}

interface StoryGeneratePayload {
  title: string;
  startDate: string;
  endDate: string;
  periodDescription: string;
}

const CreateStoryDialog = ({ 
  isOpen, 
  isGenerating, 
  onOpenChange, 
  onGenerate 
}: CreateStoryDialogProps) => {
  const [title, setTitle] = useState('');
  const [periodDescription, setPeriodDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onGenerate({
        title: title || `My Story: Last Few Days`,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        periodDescription: periodDescription || `My summary for the above provided date`,
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setPeriodDescription('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-purple-700">
            <BookMarked className="w-5 h-5 mr-2" />
            Create Your Story
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="story-title" className="block text-sm font-medium text-gray-700 mb-2">
              Story Title
            </Label>
            <Input
              id="story-title"
              placeholder="My Story: Last Few Days"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-purple-200 focus:ring-purple-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {startDate ? format(startDate, 'PPP') : 'Select start date'}
                    <CalendarIcon className="w-5 h-5 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    footer={null}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {endDate ? format(endDate, 'PPP') : 'Select end date'}
                    <CalendarIcon className="w-5 h-5 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    footer={null}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="period-description" className="block text-sm font-medium text-gray-700 mb-2">
              Period Description
            </Label>
            <Textarea
              id="period-description"
              placeholder="My summary for the above provided date"
              value={periodDescription}
              onChange={(e) => setPeriodDescription(e.target.value)}
              rows={3}
              className="border-purple-200 focus:ring-purple-300"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isGenerating || !startDate || !endDate}
              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Story
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryDialog;