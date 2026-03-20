import { authFetch } from './authFetch.js';

export const fetchVenues = () => authFetch('/api/venues');
