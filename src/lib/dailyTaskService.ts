interface DailyTaskResponse {
  _id: string;
  id: string;
  user: string; // Assuming ObjectId is represented as a string
  date: Date;
  meetings: Meeting[];
  tasks: Task[];
  mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'motivated' | 'stressed' | 'calm' |
         'anxious' | 'grateful' | 'productive' | 'tired' | 'other' | 'fun';
  journalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  summary?: Summary;
  __v: number;
}

interface Meeting {
  _id: string;
  id: string;
  title?: string;
  time?: string;
  notes?: string;
}

interface Task {
  _id: string;
  id: string;
  url?: string;
  caption?: string;
}

interface Summary {
  _id: string;
  user: string;
  entry: string;
  entryDate: string; // Or Date, if you plan to parse it
  text: string;
  aiModel: string;
  generatedAt: string; // Or Date
  updatedAt: string; // Or Date
  __v: number;
}

import apiService from './axiosService';



export const dailyTaskService = {
  // Fetch daily tasks for a specific date
  getDailyTasks: (date: string) => {
    return apiService.get<DailyTaskResponse[]>(`/entries`);
  }
  ,
  // Create a new daily task entry
  createDailyTask: (taskData: Omit<DailyTaskResponse, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
    return apiService.post<DailyTaskResponse>('/entries', taskData);
  }
  ,
  // Update an existing daily task entry
  updateDailyTask: (id: string, taskData: Omit<DailyTaskResponse, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
    return apiService.put<DailyTaskResponse>(`/entries/${id}`, taskData);
  }
  ,
  // Delete a daily task entry
  deleteDailyTask: (id: string) => {
    return apiService.delete(`/entries/${id}`);
  }
  ,
  // Get a specific daily task entry by ID
  getDailyTaskById: (id: string) => {
    return apiService.get<DailyTaskResponse>(`/entries/${id}`);
  }
  ,
  // Get task of the day
  getTaskOfTheDay: (date: string) => {
    return apiService.get<DailyTaskResponse>(`/entries?startDate=${date}`);
  }
  ,
}