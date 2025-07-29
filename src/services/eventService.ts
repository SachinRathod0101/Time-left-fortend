import api from './api';
import { User } from './userService';

// Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  revealDate: string;
  location: string;
  maxParticipants: number;
  imageUrl?: string;
  participants: string[] | User[];
  icebreakers: string[] | Icebreaker[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface Icebreaker {
  _id: string;
  question: string;
  category: string;
  createdBy: string | User;
  createdAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  eventDate: string;
  revealDate: string;
  location: string;
  maxParticipants: number;
  image?: File ;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  eventDate?: string;
  revealDate?: string;
  location?: string;
  maxParticipants?: number;
}

const eventService = {
  createEvent: async (eventData: FormData): Promise<Event> => {
    try {
      const response = await api.post('/events', eventData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (!response.data || !response.data.data) {
        console.error('Invalid response format from create event API:', response.data);
        throw new Error('Invalid server response format');
      }
      
      console.log('Event created successfully:', response.data.data._id);
      return response.data.data;
    } catch (error: any) {
      console.error('Error in createEvent service:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessage = error.response.data.errors.map((e: any) => e.msg).join(', ');
        throw new Error(errorMessage);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  },

  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get('/events');
      if (!response.data || !response.data.data) {
        console.error('Invalid response format from events API:', response.data);
        return [];
      }
      const events = Array.isArray(response.data.data) ? response.data.data : [];
      console.log(`Successfully fetched ${events.length} events`);
      return events;
    } catch (error: any) {
      console.error('Error in getAllEvents service:', error.message);
      throw error;
    }
  },

  getEventById: async (eventId: string): Promise<Event> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data.data;
  },

  updateEvent: async (eventId: string, eventData: UpdateEventData): Promise<Event> => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data.data;
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    await api.delete(`/events/${eventId}`);
  },

  joinEvent: async (eventId: string): Promise<Event> => {
    const response = await api.put(`/events/${eventId}/join`);
    return response.data.data;
  },

  leaveEvent: async (eventId: string): Promise<Event> => {
    const response = await api.put(`/events/${eventId}/leave`);
    return response.data.data;
  },

  approveEvent: async (eventId: string): Promise<Event> => {
    const response = await api.put(`/events/${eventId}/approve`);
    return response.data.data;
  },

  rejectEvent: async (eventId: string, reason: string): Promise<Event> => {
    const response = await api.put(`/events/${eventId}/reject`, { reason });
    return response.data.data;
  },
};

export default eventService;