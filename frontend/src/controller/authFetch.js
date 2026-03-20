import * as Config from 'config/index.jsx';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem(Config.AUTH_TOKEN);
  const response = await fetch(`${SERVER_URL}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || Config.UNKNOWN_ERROR);
  }

  return response.json();
};
