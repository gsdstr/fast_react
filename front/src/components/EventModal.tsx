import { useState, useEffect } from 'react';
import { Event, EventCreate, EventUpdate } from '@/lib/api';
import { useEventsStore } from '@/store/events';
import { format } from 'date-fns';

interface EventModalProps {
  event?: Event;
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date | null;
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField = ({ label, children }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const inputClassName = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900";

export function EventModal({ event, isOpen, onClose, initialDate }: EventModalProps) {
  const { createEvent, updateEvent, deleteEvent } = useEventsStore();
  const [formData, setFormData] = useState<EventCreate | EventUpdate>({
    title: '',
    description: '',
    location: '',
    date: '',
    duration: 60,
    capacity: 0,
    is_active: true,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
        duration: event.duration || 60,
        capacity: event.capacity || 0,
        is_active: event.is_active ?? true,
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        date: format(initialDate, "yyyy-MM-dd'T'HH:mm"),
      }));
    }
  }, [event, initialDate]);

  const updateField = <K extends keyof (EventCreate | EventUpdate)>(
    field: K,
    value: (EventCreate | EventUpdate)[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (event) {
        await updateEvent(event.id, formData as EventUpdate);
      } else {
        await createEvent(formData as EventCreate);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Title">
            <input
              type="text"
              required
              placeholder="Add title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={inputClassName}
            />
          </FormField>

          <div className="flex gap-4">
            <FormField label="Date">
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className={inputClassName}
              />
            </FormField>

            <FormField label="Duration">
              <div>
                <input
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(e) => updateField('duration', parseInt(e.target.value) || 60)}
                  className={inputClassName}
                />
                <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
              </div>
            </FormField>
          </div>

          <FormField label="Location">
            <input
              type="text"
              placeholder="Add location"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              className={inputClassName}
            />
          </FormField>

          <FormField label="Description">
            <textarea
              placeholder="Add description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={inputClassName}
              rows={3}
            />
          </FormField>

          <FormField label="Capacity">
            <input
              type="number"
              min="0"
              value={formData.capacity}
              onChange={(e) => updateField('capacity', parseInt(e.target.value))}
              className={inputClassName}
            />
          </FormField>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is-active"
              checked={formData.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is-active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            {event && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 