import { authFetch } from './authFetch.js';

export const sendPrompt = (formData) =>
  authFetch('/agent/draft', {
    method: 'POST',
    body: formData,
  });
