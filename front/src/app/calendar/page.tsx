'use client';

import React, { useState } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import { useEventsStore } from '@/store/events';
import { CalendarGrid } from '@/components/Calendar/CalendarGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CalendarPage() {
  const { events, isLoading, error } = useEventsStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePreviousWeek = () => {
    setSelectedDate((date) => subWeeks(date, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate((date) => addWeeks(date, 1));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousWeek}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Previous Week
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
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