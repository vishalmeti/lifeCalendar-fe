import { Clock } from 'lucide-react';

interface MeetingsSectionProps {
  meetings: string[];
}

const MeetingsSection = ({ meetings }: MeetingsSectionProps) => {
  if (!meetings || meetings.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Meetings
      </h3>
      <ul className="space-y-2">
        {meetings.map((meeting, index) => (
          <li key={index} className="bg-gray-50 p-3 rounded-lg">
            {meeting}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingsSection;