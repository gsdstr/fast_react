'use client';

import { useEffect, useState } from 'react';
import { useEventsStore } from '@/store/events';
import { format } from 'date-fns';
import { EventModal } from '@/components/EventModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Event } from '@/lib/api';

export default function EventsPage() {
  const { events, isLoading, error, fetchEvents, deleteEvent } = useEventsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateClick = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (event: Event) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(event.id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCreateClick}
        >
          Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No events found. Create your first event!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              {event.description && (
                <p className="text-gray-600 mb-4">{event.description}</p>
              )}
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{format(new Date(event.date), 'PPP')}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.capacity !== undefined && event.capacity > 0 && (
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="text-blue-500 hover:text-blue-600"
                  onClick={() => handleEditClick(event)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteClick(event)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
