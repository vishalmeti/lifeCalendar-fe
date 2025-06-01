import { useState } from 'react';
import { BookMarked, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface CreateStoryDialogProps {
  isOpen: boolean;
  isGenerating: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (period: string, prompt: string) => void;
}

const CreateStoryDialog = ({ 
  isOpen, 
  isGenerating, 
  onOpenChange, 
  onGenerate 
}: CreateStoryDialogProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const timePeriods = [
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleSubmit = () => {
    onGenerate(selectedPeriod, customPrompt);
  };

  const resetForm = () => {
    setSelectedPeriod('');
    setCustomPrompt('');
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="border-purple-200 focus:ring-purple-300">
                <SelectValue placeholder="Select a time period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Prompt
            </label>
            <Textarea
              id="story-prompt"
              placeholder="Describe what kind of story or reflection you'd like AI to create."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
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
              disabled={!selectedPeriod || !customPrompt.trim() || isGenerating}
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