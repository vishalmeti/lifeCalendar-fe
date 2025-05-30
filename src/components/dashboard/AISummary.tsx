import { FileText } from 'lucide-react';
import React from 'react';

interface AISummaryProps {
  summary: string;
  truncate?: boolean; // Add prop to control truncation
}

const AISummary = ({ summary, truncate = true }: AISummaryProps) => {
  if (!summary) return null;

  // Function to format the text with bold elements
  const formatText = (text: string) => {
    // Replace **text** with bold elements
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract text between ** markers and make it bold
        const boldText = part.substring(2, part.length - 2);
        return <strong key={index}>{boldText}</strong>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  // Process the summary content
  const renderSummary = () => {
    if (truncate) {
      // When truncated, keep original behavior but with basic formatting
      return <p className="text-indigo-800 leading-relaxed line-clamp-2">{formatText(summary)}</p>;
    } else {
      // When not truncated, handle newlines and bold text
      // Split on actual \n characters (not literal \\n)
      return summary.split(/\\n|\n/).map((paragraph, index) => {
        // Skip empty paragraphs
        if (!paragraph.trim()) return null;
        
        return (
          <p key={index} className="text-indigo-800 leading-relaxed mb-2">
            {formatText(paragraph)}
          </p>
        );
      }).filter(Boolean); // Remove null entries
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-l-indigo-400">
      <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
        <FileText className="w-4 h-4 mr-2" />
        AI Summary
      </h3>
      {renderSummary()}
    </div>
  );
};

export default AISummary;