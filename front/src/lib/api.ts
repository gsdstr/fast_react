import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  capacity?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface EventCreate {
  title: string;
  description?: string;
  location?: string;
  date: string;
  capacity?: number;
  is_active?: boolean;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  capacity?: number;
  is_active?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const eventsApi = {
  list: async (params?: { skip?: number; limit?: number; active_only?: boolean }) => {
    const response = await api.get<Event[]>('/api/v1/events/', { params });
    return response.data;
  },

  get: async (id: number) => {
    const response = await api.get<Event>(`/api/v1/events/${id}`);
    return response.data;
  },

  create: async (event: EventCreate) => {
    const response = await api.post<Event>('/api/v1/events/', event);
    return response.data;
  },

  update: async (id: number, event: EventUpdate) => {
    const response = await api.patch<Event>(`/api/v1/events/${id}`, event);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/v1/events/${id}`);
  },
}; 