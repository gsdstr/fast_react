import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isWithinInterval, addMinutes, isSameDay, isToday } from 'date-fns';
import { Event } from '@/lib/api';
import { CalendarEvent } from './CalendarEvent';
import { EventModal } from '@/components/EventModal';

interface CalendarGridProps {
  events: Event[];
  selectedDate: Date;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_OF_WEEK = Array.from({ length: 7 }, (_, i) => i);

export function CalendarGrid({ events, selectedDate }: CalendarGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 0 });

  const handleCellClick = (day: number, hour: number) => {
    const selectedDateTime = addDays(startOfCurrentWeek, day);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setSelectedTime(selectedDateTime);
    setIsModalOpen(true);
  };

  // Process events to handle multi-hour spans
  const getEventsForDay = (day: number) => {
    const currentDate = addDays(startOfCurrentWeek, day);
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = addDays(currentDate, 1);

    return events.filter((event) => {
      const eventStart = new Date(event.date);
      const eventEnd = addMinutes(eventStart, event.duration || 60);
      return isWithinInterval(eventStart, { start: currentDate, end: nextDate }) ||
             isWithinInterval(eventEnd, { start: currentDate, end: nextDate }) ||
             (eventStart <= currentDate && eventEnd >= nextDate);
    });
  };

  // Calculate top position for current time indicator
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours + minutes / 60) * 48; // 48px per hour
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        <div className="w-16" />
        {DAYS_OF_WEEK.map((day) => {
          const date = addDays(startOfCurrentWeek, day);
          const isCurrentDay = isToday(date);
          return (
            <div
              key={day}
              className={`flex-1 text-center py-3 border-l ${
                isCurrentDay ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-sm text-gray-600">{format(date, 'EEE')}</div>
              <div className={`text-lg font-semibold ${
                isCurrentDay ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {format(date, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex flex-1 overflow-auto relative">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 sticky left-0 bg-white z-10">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-12 border-b text-xs text-gray-500 relative"
            >
              <span className="absolute -top-2 right-2">
                {format(new Date().setHours(hour), 'ha')}
              </span>
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="flex flex-1 relative">
          {DAYS_OF_WEEK.map((day) => {
            const dayEvents = getEventsForDay(day);
            const date = addDays(startOfCurrentWeek, day);
            const isCurrentDay = isToday(date);

            return (
              <div 
                key={day} 
                className={`flex-1 border-l relative ${
                  isCurrentDay ? 'bg-blue-50/30' : ''
                }`}
              >
                {/* Hour cells */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-12 border-b relative group hover:bg-gray-50"
                    onClick={() => handleCellClick(day, hour)}
                  >
                    {/* Half-hour marker */}
                    <div className="absolute top-1/2 left-0 right-0 border-t border-gray-100" />
                  </div>
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const eventStart = new Date(event.date);
                  const eventHour = eventStart.getHours();
                  const eventMinutes = eventStart.getMinutes();
                  const topPosition = (eventHour + eventMinutes / 60) * 48;

                  return (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0"
                      style={{ top: `${topPosition}px` }}
                    >
                      <CalendarEvent event={event} />
                    </div>
                  );
                })}

                {/* Current time indicator */}
                {isCurrentDay && (
                  <div 
                    className="absolute left-0 right-0 flex items-center z-20"
                    style={{ top: `${getCurrentTimePosition()}px` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                    <div className="flex-1 border-t border-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedTime}
      />
    </div>
  );
} 