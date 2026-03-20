import { authFetch } from './authFetch.js';

export const fetchEvents = (includeDrafts = false) =>
  authFetch(includeDrafts ? '/api/events/drafts' : '/api/events');

export const deleteEvents = (titles) =>
  authFetch('/api/events', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titles }),
  });

export const submitEvent = (formData, eventId = null) =>
  authFetch(eventId ? `/api/events/${eventId}` : '/api/events', {
    method: eventId ? 'PUT' : 'POST',
    body: formData,
  });
