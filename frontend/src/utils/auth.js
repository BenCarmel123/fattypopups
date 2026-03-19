import * as Config from '../config/index.jsx';

// Handle token retrieval and verification
export const handleTokenCheck = () => {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  // Backend Sent Token
  if (tokenFromUrl) {
    localStorage.setItem(Config.AUTH_TOKEN, tokenFromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }

  const token = localStorage.getItem(Config.AUTH_TOKEN);

  return token;
};
