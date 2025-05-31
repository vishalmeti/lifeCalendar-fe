interface DailyTaskResponse {
  _id: string;
  id: string;
  user: string; // Assuming ObjectId is represented as a string
  date: Date;
  meetings: Meeting[];
  tasks: Task[];
  mood?:
    | "happy"
    | "sad"
    | "neutral"
    | "excited"
    | "motivated"
    | "stressed"
    | "calm"
    | "anxious"
    | "grateful"
    | "productive"
    | "tired"
    | "other"
    | "fun";
  journalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  summary?: Summary;
  __v: number;
}

interface Summary {
  text: string;
  content: string;
  generatedAt?: Date;
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

// Add new interfaces for creation payload
interface CreateMeeting {
  title?: string;
  time?: string;
  notes?: string;
}

interface CreateTask {
  url?: string;
  caption?: string;
}

interface CreateDailyTask {
  date: string;
  meetings: CreateMeeting[];
  tasks: CreateTask[];
  mood?:
    | "happy"
    | "sad"
    | "neutral"
    | "excited"
    | "motivated"
    | "stressed"
    | "calm"
    | "anxious"
    | "grateful"
    | "productive"
    | "tired"
    | "other"
    | "fun";
  journalNotes?: string;
  summary?: Summary;
}

import apiService from "./axiosService";

export const dailyTaskService = {
  // Fetch daily tasks for a specific date
  getDailyTasks: (date: string) => {
    return apiService.get<DailyTaskResponse[]>(`/entries`);
  },

  getMonthlyTasks: (startDate: string, endDate: string) => {
    return apiService.get<DailyTaskResponse[]>(`/entries?startDate=${startDate}&endDate=${endDate}`);
  },
  // Create a new daily task entry
  createDailyTask: (taskData: CreateDailyTask) => {
    return apiService.post<DailyTaskResponse>("/entries", taskData);
  },
  // Update an existing daily task entry
  updateDailyTask: (
    id: string,
    taskData: CreateDailyTask
  ) => {
    return apiService.put<DailyTaskResponse>(`/entries/${id}`, taskData);
  },
  // Delete a daily task entry
  deleteDailyTask: (id: string) => {
    return apiService.delete(`/entries/${id}`);
  },
  // Get a specific daily task entry by ID
  getDailyTaskById: (id: string) => {
    return apiService.get<DailyTaskResponse>(`/entries/${id}`);
  },
  // Get task of the day
  getTaskOfTheDay: (date: string) => {
    return apiService.get<DailyTaskResponse>(`/entries?startDate=${date}`);
  },
};
