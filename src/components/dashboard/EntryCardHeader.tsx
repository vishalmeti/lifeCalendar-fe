import { Calendar, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EntryCardHeaderProps {
  date: string;
  mood: string;
  moodBadgeClassName: string;
  onEditClick?: (e?: React.MouseEvent) => void;
  onDeleteClick?: (e?: React.MouseEvent) => void;
  hideButtons?: boolean;
}

const EntryCardHeader = ({ 
  date, 
  mood, 
  moodBadgeClassName, 
  onEditClick, 
  onDeleteClick,
  hideButtons = false
}: EntryCardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
        <Badge className={`${moodBadgeClassName} text-xs sm:text-sm`}>
          <Smile className="w-3 h-3 mr-1" />
          {mood}
        </Badge>
      </div>
      {!hideButtons && onEditClick && onDeleteClick && (
        <div className="flex space-x-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteClick}
            className="text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntryCardHeader;