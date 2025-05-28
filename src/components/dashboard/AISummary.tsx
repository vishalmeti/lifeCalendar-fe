import { FileText } from 'lucide-react';

interface AISummaryProps {
  summary: string;
  truncate?: boolean; // Add prop to control truncation
}

const AISummary = ({ summary, truncate = true }: AISummaryProps) => {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-l-indigo-400">
      <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
        <FileText className="w-4 h-4 mr-2" />
        AI Summary
      </h3>
      <p className={`text-indigo-800 leading-relaxed ${truncate ? 'line-clamp-2' : ''}`}>
        {summary}
      </p>
    </div>
  );
};

export default AISummary;