import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import eventService, { Event, CreateEventData, UpdateEventData } from '../services/eventService';
import { useCallback } from 'react';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  loading: boolean;
  error: string | null;
  createEvent: (eventData: FormData) => Promise<Event | null>;
  updateEvent: (eventId: string, eventData: UpdateEventData) => Promise<Event | null>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  joinEvent: (eventId: string) => Promise<Event | null>;
  leaveEvent: (eventId: string) => Promise<Event | null>;
  approveEvent: (eventId: string) => Promise<Event | null>;
  rejectEvent: (eventId: string, reason: string) => Promise<Event | null>;
  fetchEvents: () => Promise<void>;
  clearError: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, token } = useAuth();
  const hasFetchedRef = useRef(false);

  const userEvents = events.filter(
    (event) =>
      (typeof event.createdBy === 'string' ? event.createdBy === user?._id : event.createdBy?._id === user?._id) ||
      event.participants.some(participant =>
        typeof participant === 'string' ? participant === user?._id : participant._id === user?._id
      )
  );

  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setEvents([]);
      setError('Not authenticated or token missing');
      return;
    }

    setLoading(true);
    setError(null);

    const maxRetries = 3;
    let retries = 0;
    let eventsData: Event[] = [];

    while (retries < maxRetries) {
      try {
        eventsData = await eventService.getAllEvents();
        break;
      } catch (retryErr: any) {
        retries++;
        if (retries >= maxRetries) {
          setError('Failed after multiple retries');
          console.error('Final failure:', retryErr);
          break;
        }
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, retries)));
      }
    }

    setEvents(Array.isArray(eventsData) ? eventsData : []);
    setLoading(false);
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && token && !hasFetchedRef.current) {
      fetchEvents();
      hasFetchedRef.current = true;
    }
  }, [fetchEvents, isAuthenticated, token]);

  const createEvent = async (eventData: FormData): Promise<Event | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !token) {
        setError('Authentication required. Please log in again.');
        return null;
      }

      const newEvent = await eventService.createEvent(eventData);
      console.log('Event created successfully:', newEvent);
      if (newEvent) {
        setEvents(prev => [...prev, newEvent]);
        return newEvent;
      }
      return null;
    } catch (err: any) {
      console.error('Create event error:', err);
      let errorMessage = 'Failed to create event';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: UpdateEventData): Promise<Event | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      if (updatedEvent) setEvents(events.map(event => event._id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(event => event._id !== eventId));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string): Promise<Event | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.joinEvent(eventId);
      if (updatedEvent) setEvents(events.map(event => event._id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId: string): Promise<Event | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.leaveEvent(eventId);
      if (updatedEvent) setEvents(events.map(event => event._id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to leave event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const approveEvent = async (eventId: string): Promise<Event | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.approveEvent(eventId);
      if (updatedEvent) setEvents(events.map(event => event._id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectEvent = async (eventId: string, reason: string): Promise<Event | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.rejectEvent(eventId, reason);
      if (updatedEvent) setEvents(events.map(event => event._id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        userEvents,
        loading,
        error,
        createEvent,
        updateEvent,
        deleteEvent,
        joinEvent,
        leaveEvent,
        approveEvent,
        rejectEvent,
        fetchEvents,
        clearError,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;