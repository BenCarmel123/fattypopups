// API helper functions for database operations

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// ========== EVENTS ==========

// Fetch all events, optionally including drafts
export async function fetchEvents(includeDrafts = false) {
  const url = `${SERVER_URL}/api/events${includeDrafts ? '?includeDrafts=true' : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

// Delete events by titles
export async function deleteEvents(titles) {
  const response = await fetch(`${SERVER_URL}/api/events`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titles }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete events');
  }

  return response.json();
}

// ========== CHEFS ==========

// Fetch all chefs with names and instagram handles
export async function fetchChefs() {
  const response = await fetch(`${SERVER_URL}/api/chefs`);

  if (!response.ok) {
    throw new Error('Failed to fetch chefs');
  }

  return response.json();
}

// ========== VENUES ==========

// Fetch all venues with names, addresses, and instagram handles
export async function fetchVenues() {
  const response = await fetch(`${SERVER_URL}/api/venues`);

  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }

  return response.json();
}

// ========== COMBINED ==========

// Fetch both chefs and venues in parallel
export async function fetchHistory() {
  const [chefs, venues] = await Promise.all([
    fetchChefs(),
    fetchVenues()
  ]);

  return { chefs, venues };
}
