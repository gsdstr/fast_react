'use client';

import React, { useState, useEffect } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import { useEventsStore } from '@/store/events';
import { CalendarGrid } from '@/components/Calendar/CalendarGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CalendarPage() {
  const { events, isLoading, error, fetchEvents } = useEventsStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePreviousWeek = () => {
    setSelectedDate((date) => subWeeks(date, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate((date) => addWeeks(date, 1));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed">
              Previous Week
            </button>
            <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed">
              Today
            </button>
            <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed">
              Next Week
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div className="text-red-500 flex flex-col items-center gap-4">
              <p>{error}</p>
              <button
                onClick={() => fetchEvents()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousWeek}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Previous Week
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Next Week
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <CalendarGrid events={events} selectedDate={selectedDate} />
      </div>
    </div>
  );
} 