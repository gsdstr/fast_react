import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
      <p className="text-gray-500 text-sm">Loading events...</p>
    </div>
  );
} 