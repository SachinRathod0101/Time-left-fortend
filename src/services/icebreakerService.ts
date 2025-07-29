import api from './api';
import { Icebreaker } from './eventService';

// Types
export interface CreateIcebreakerData {
  question: string;
  category: string;
}

export interface UpdateIcebreakerData {
  question?: string;
  category?: string;
}

// Icebreaker service functions
const icebreakerService = {
  // Create a new icebreaker
  createIcebreaker: async (icebreakerData: CreateIcebreakerData): Promise<Icebreaker> => {
    const response = await api.post('/icebreakers', icebreakerData);
    return response.data.data;
  },

  // Get all icebreakers
  getAllIcebreakers: async (): Promise<Icebreaker[]> => {
    const response = await api.get('/icebreakers');
    return response.data.data;
  },

  // Get icebreaker by ID
  getIcebreakerById: async (icebreakerId: string): Promise<Icebreaker> => {
    const response = await api.get(`/icebreakers/${icebreakerId}`);
    return response.data.data;
  },

  // Update icebreaker
  updateIcebreaker: async (icebreakerId: string, icebreakerData: UpdateIcebreakerData): Promise<Icebreaker> => {
    const response = await api.put(`/icebreakers/${icebreakerId}`, icebreakerData);
    return response.data.data;
  },

  // Delete icebreaker
  deleteIcebreaker: async (icebreakerId: string): Promise<void> => {
    await api.delete(`/icebreakers/${icebreakerId}`);
  },

  // Add icebreaker to event
  addIcebreakerToEvent: async (eventId: string, icebreakerId: string): Promise<void> => {
    await api.post(`/events/${eventId}/icebreakers`, { icebreakerId });
  },

  // Remove icebreaker from event
  removeIcebreakerFromEvent: async (eventId: string, icebreakerId: string): Promise<void> => {
    await api.delete(`/events/${eventId}/icebreakers/${icebreakerId}`);
  },
};

export default icebreakerService;