import { BookOpen, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <Card className="border border-dashed border-gray-300 bg-gray-50">
      <CardContent className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-70" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Create your first AI-powered story using the floating button at the bottom right. 
          The AI will analyze your entries and craft a meaningful narrative.
        </p>
        <Button 
          variant="outline" 
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
          onClick={onCreateClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Story
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;