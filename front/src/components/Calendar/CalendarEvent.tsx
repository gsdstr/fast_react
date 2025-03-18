import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Event } from '@/lib/api';
import { EventModal } from '@/components/EventModal';

interface CalendarEventProps {
  event: Event;
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse UTC date from server to local time
  const eventDate = parseISO(event.date);
  const eventTime = format(eventDate, 'h:mm a');
  const duration = event.duration || 60;
  const heightInPixels = Math.max((duration / 60) * 48, 24); // Minimum height of 24px

  return (
    <>
      <div
        className="mx-1 group relative"
        style={{ height: `${heightInPixels}px` }}
      >
        <div
          className="absolute inset-0 bg-blue-100 border border-blue-200 rounded p-2 cursor-pointer 
                     hover:bg-blue-200 transition-colors text-sm overflow-hidden shadow-sm
                     group-hover:shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <div className="font-medium text-blue-900 truncate">{event.title}</div>
          <div className="text-xs text-blue-700 flex items-center gap-1">
            <span>{eventTime}</span>
            <span>•</span>
            <span>{duration}m</span>
            {event.location && (
              <>
                <span>•</span>
                <span className="truncate">{event.location}</span>
              </>
            )}
          </div>
          {event.description && (
            <div className="text-xs text-blue-600 mt-1 line-clamp-2">
              {event.description}
            </div>
          )}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  );
} 