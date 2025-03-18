import React, { useState } from 'react';
import { format } from 'date-fns';
import { Event } from '@/lib/api';
import { CreateEventModal } from './CreateEventModal';

interface CalendarEventProps {
  event: Event;
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eventDate = new Date(event.date);
  const eventTime = format(eventDate, 'h:mm a');
  const duration = event.duration || 60; // Default to 60 minutes if not specified
  const heightInPixels = (duration / 60) * 48; // 48px per hour

  return (
    <>
      <div
        className="absolute inset-x-0 bg-blue-100 border border-blue-200 rounded p-1 mx-1 cursor-pointer hover:bg-blue-200 transition-colors text-sm truncate"
        style={{ height: `${heightInPixels}px` }}
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      >
        <div className="font-medium">{event.title}</div>
        <div className="text-xs text-gray-600">
          {eventTime} • {duration} min
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  );
} 