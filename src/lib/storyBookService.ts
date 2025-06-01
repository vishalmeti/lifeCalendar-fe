import apiService from "./axiosService";

// Define response types
export interface Story {
  _id: string;
  user: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  relatedEntryIds: string[];
  aiModel: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// StoryBook API service
export const storyBookService = {
  // Get all stories
  getAllStories: () => {
    return apiService.get<Story[]>('/stories');
  },

  // Get a specific story by ID
  getStoryById: (id: string) => {
    return apiService.get<Story>(`/stories/${id}`);
  },

  // Create a new story
  createStory: (storyData: Partial<Story>) => {
    return apiService.post<Story>('/stories', storyData);
  },

  // Update an existing story
  updateStory: (id: string, storyData: Partial<Story>) => {
    return apiService.put<Story>(`/stories/${id}`, storyData);
  },

  // Delete a story
  deleteStory: (id: string) => {
    return apiService.delete<void>(`/stories/${id}`);
  },

  // Get stories by date range
  getStoriesByDateRange: (startDate: string, endDate: string) => {
    return apiService.get<Story[]>(`/stories?startDate=${startDate}&endDate=${endDate}`);
  }
};

export default storyBookService;