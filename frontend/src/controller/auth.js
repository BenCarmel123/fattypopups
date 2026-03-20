import { authFetch } from './authFetch.js';

export const checkAuth = () => authFetch('/auth/check');
