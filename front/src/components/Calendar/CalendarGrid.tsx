import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Event } from '@/lib/api';
import { CalendarEvent } from './CalendarEvent';
import { CreateEventModal } from './CreateEventModal';

interface CalendarGridProps {
  events: Event[];
  selectedDate: Date;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_OF_WEEK = Array.from({ length: 7 }, (_, i) => i);

export function CalendarGrid({ events, selectedDate }: CalendarGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 0 });

  const handleCellClick = (day: number, hour: number) => {
    const selectedDateTime = addDays(startOfCurrentWeek, day);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setSelectedTime(selectedDateTime);
    setIsModalOpen(true);
  };

  const getEventsForDayAndHour = (day: number, hour: number) => {
    const currentDate = addDays(startOfCurrentWeek, day);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        isSameDay(eventDate, currentDate) && eventDate.getHours() === hour
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex border-b">
        <div className="w-16" /> {/* Time column spacer */}
        {DAYS_OF_WEEK.map((day) => {
          const date = addDays(startOfCurrentWeek, day);
          return (
            <div
              key={day}
              className="flex-1 text-center py-2 font-semibold border-l"
            >
              <div>{format(date, 'EEE')}</div>
              <div className="text-lg">{format(date, 'd')}</div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex flex-1 overflow-auto">
        {/* Time column */}
        <div className="w-16 flex-shrink-0">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-12 border-b text-xs text-right pr-2 -mt-2"
            >
              {format(new Date().setHours(hour), 'ha')}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="flex flex-1">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex-1 border-l">
              {HOURS.map((hour) => {
                const eventsForCell = getEventsForDayAndHour(day, hour);
                return (
                  <div
                    key={hour}
                    className="h-12 border-b relative group"
                    onClick={() => handleCellClick(day, hour)}
                  >
                    {eventsForCell.map((event) => (
                      <CalendarEvent key={event.id} event={event} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedTime}
      />
    </div>
  );
} 