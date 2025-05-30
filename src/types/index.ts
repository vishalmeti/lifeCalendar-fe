// Define shared types used across components

export interface Meeting {
  title: string;
  time: string; // Changed from optional to required to match EntryModal
  amPm?: 'AM' | 'PM'; // Added amPm property
  notes?: string;
}

export interface Task {
  caption: string;
  url?: string;
}

export interface Summary {
  content: string;
  // text: string;
  generatedAt?: Date;
  // Add any other properties that might exist in the summary object
}

export interface Entry {
  id: string;
  date: string;
  meetings: Meeting[];
  tasks: Task[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'motivated' | 'stressed' | 'calm' | 'fun' | 'anxious' | 'grateful' | 'productive' | 'tired' | 'other';
  journalNotes: string;
  summary?: string | Summary; // Updated to accept either string or Summary object
}

export interface MoodColors {
  happy: string;
  sad: string;
  neutral: string;
  excited: string;
  motivated: string;
  stressed: string;
  calm: string;
  fun: string;
  anxious: string;
  grateful: string;
  productive: string;
  tired: string;
  other: string;
  [key: string]: string;
}
