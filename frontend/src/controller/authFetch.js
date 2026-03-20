import * as Config from 'config/index.jsx';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const authFetch = async (path, { method = 'GET', headers = {}, body = undefined } = {}) => {
  const token = localStorage.getItem(Config.AUTH_TOKEN);
  const response = await fetch(`${SERVER_URL}${path}`, {
    method,
    body,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || Config.UNKNOWN_ERROR);
  }

  return response.json();
};
