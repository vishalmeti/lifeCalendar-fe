import { Clock } from 'lucide-react';

interface Meeting {
  title: string;
  time?: string;
  notes?: string;
}

interface MeetingsSectionProps {
  meetings: Meeting[];
}

const MeetingsSection = ({ meetings }: MeetingsSectionProps) => {
  if (!meetings || meetings.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Meetings
      </h3>
      <ul className="space-y-3">
        {meetings.map((meeting, index) => (
          <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="font-medium text-gray-800">{meeting.title}</div>
            {meeting.time && (
              <div className="text-xs text-gray-500 mt-1">{meeting.time}</div>
            )}
            {meeting.notes && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                {meeting.notes}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingsSection;