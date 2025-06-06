import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import storyBookService, { Story } from '../lib/storyBookService';
import { toast } from './ui/use-toast';
import StoryList from './storybook/StoryList';
import CreateStoryDialog from './storybook/CreateStoryDialog';

interface StoryGeneratePayload {
  title: string;
  startDate: string;
  endDate: string;
  periodDescription: string;
}

const Storybook = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await storyBookService.getAllStories();
      setStories(response.data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stories. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStory = async (storyData: StoryGeneratePayload) => {
    setIsGenerating(true);
    
    try {
      // Make API call to create story
      const response = await storyBookService.createStory(storyData);
      
      // Add the new story to the state
      setStories([response.data, ...stories]);
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Your story has been generated successfully!',
      });
    } catch (error) {
      console.error('Failed to generate story:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate story. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setIsCreateDialogOpen(false); // Close dialog after submission
    }
  };

  const deleteStory = async (storyId: string) => {
    try {
      await storyBookService.deleteStory(storyId);
      setStories(stories.filter(story => story._id !== storyId));
      toast({
        title: 'Success',
        description: 'Story deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete story:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete story. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Storybook</h1>
        <p className="text-gray-600">Let AI craft meaningful narratives from your life entries</p>
      </div>

      {/* Stories List Component */}
      <StoryList 
        stories={stories}
        isLoading={isLoading}
        isGenerating={isGenerating}
        onDeleteStory={deleteStory}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      {/* Create Story Dialog */}
      <CreateStoryDialog 
        isOpen={isCreateDialogOpen}
        isGenerating={isGenerating}
        onOpenChange={setIsCreateDialogOpen}
        onGenerate={handleGenerateStory}
      />

      {/* Floating Create Story Button */}
      <Button 
        onClick={() => setIsCreateDialogOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Storybook;
