import { create } from 'zustand';
import { Event, EventCreate, EventUpdate, eventsApi } from '@/lib/api';

interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  fetchEvents: (params?: { skip?: number; limit?: number; active_only?: boolean }) => Promise<void>;
  fetchEvent: (id: number) => Promise<void>;
  createEvent: (event: EventCreate) => Promise<void>;
  updateEvent: (id: number, event: EventUpdate) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  selectedEvent: null,
  isLoading: true,
  error: null,

  fetchEvents: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const events = await eventsApi.list(params);
      set({ events, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  fetchEvent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const event = await eventsApi.get(id);
      set({ selectedEvent: event, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch event', isLoading: false });
    }
  },

  createEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });
      const newEvent = await eventsApi.create(event);
      set((state) => ({
        events: [...state.events, newEvent],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create event', isLoading: false });
    }
  },

  updateEvent: async (id, event) => {
    try {
      set({ isLoading: true, error: null });
      const updatedEvent = await eventsApi.update(id, event);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
        selectedEvent: updatedEvent,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update event', isLoading: false });
    }
  },

  deleteEvent: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await eventsApi.delete(id);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        selectedEvent: null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete event', isLoading: false });
    }
  },
})); 