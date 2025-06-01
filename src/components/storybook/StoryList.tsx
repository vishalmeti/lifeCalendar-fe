import { BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';
import StoryCard from './StoryCard';
import EmptyState from './EmptyState';
import { Story } from '../../lib/storyBookService';

interface StoryListProps {
  stories: Story[];
  isLoading: boolean;
  isGenerating: boolean;
  onDeleteStory: (storyId: string) => void;
  onCreateClick: () => void;
}

const StoryList = ({
  stories,
  isLoading,
  isGenerating,
  onDeleteStory,
  onCreateClick
}: StoryListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg text-gray-600">Loading stories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        <BookOpen className="w-5 h-5 mr-2" />
        Your Stories
        <Badge variant="outline" className="ml-3">
          {stories.length}
        </Badge>
      </h2>
      
      {isGenerating && (
        <Card className="border-l-4 border-l-purple-500 bg-purple-50 animate-pulse mb-4">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
              <p className="text-purple-700 font-medium">AI is crafting your story...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      )}

      {stories.map((story) => (
        <StoryCard 
          key={story._id} 
          story={story} 
          onDelete={onDeleteStory}
        />
      ))}

      {stories.length === 0 && !isGenerating && (
        <EmptyState onCreateClick={onCreateClick} />
      )}
    </div>
  );
};

export default StoryList;