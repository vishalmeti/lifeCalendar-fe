interface NotesSectionProps {
  notes: string; // This will now receive journalNotes
}

const NotesSection = ({ notes }: NotesSectionProps) => {
  if (!notes) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Journal Notes</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notes}</p>
      </div>
    </div>
  );
};

export default NotesSection;