import { useState } from 'react';
import { Calendar, Eye, Trash2, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Story } from '../../lib/storyBookService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface StoryCardProps {
  story: Story;
  onDelete: (storyId: string) => void;
}

const StoryCard = ({ story, onDelete }: StoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 border ${
        isExpanded 
          ? 'border-purple-300 shadow-md' 
          : 'border-gray-200'
      }`}
    >
      <CardHeader className="bg-white pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="text-xl text-gray-900 mb-2 font-medium leading-tight line-clamp-2 hover:text-purple-700 transition-colors">
                    {story.title}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  {story.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(story.startDate).toLocaleDateString()} - {new Date(story.endDate).toLocaleDateString()}
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {story.content.split(' ').length} words
              </Badge>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(story.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Button
              variant={isExpanded ? "default" : "outline"}
              size="sm"
              onClick={toggleExpansion}
              className={isExpanded ? "bg-purple-600 text-white hover:bg-purple-700" : "hover:bg-purple-50"}
            >
              <Eye className="w-4 h-4 mr-1" />
              {isExpanded ? 'Collapse' : 'Read'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(story._id)}
              className="text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <Separator className="mx-6" />
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-l-purple-400">
                {story.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed last:mb-0 font-serif">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-center pt-3 pb-3">
            <span className="text-xs text-gray-500">
              Generated with {story.aiModel} • {new Date(story.createdAt).toLocaleString()}
            </span>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default StoryCard;