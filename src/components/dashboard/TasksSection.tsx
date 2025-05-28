import { FileText, Link as LinkIcon } from 'lucide-react';

interface Task {
  caption: string;
  url?: string;
}

interface TasksSectionProps {
  tasks: Task[];
  truncate?: boolean; // Add prop to control truncation
}

const TasksSection = ({ tasks, truncate = true }: TasksSectionProps) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <FileText className="w-4 h-4 mr-2" />
        Tasks
      </h3>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className={truncate ? 'truncate max-w-[85%]' : ''}>{task.caption}</span>
              {task.url && (
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 ml-2 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()} // Prevent card click event when clicking link
                >
                  <LinkIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksSection;