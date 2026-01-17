import { AUTH_TOKEN } from '../config/index.jsx';

// Handle token retrieval and verification
export const handleTokenCheck = () => {
  // Check if token in URL
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  // Backend Sent Token
  if (tokenFromUrl) {
    console.log("[AUTH] Token from URL:", tokenFromUrl);
    localStorage.setItem(AUTH_TOKEN, tokenFromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }

  // Verify Token
  console.log("[AUTH] Token in storage:", localStorage.getItem(AUTH_TOKEN));
  const token = localStorage.getItem(AUTH_TOKEN);

  return token;
};
