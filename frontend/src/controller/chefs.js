import { authFetch } from './authFetch.js';

export const fetchChefs = () => authFetch('/api/chefs');
