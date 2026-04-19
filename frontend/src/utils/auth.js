import * as Config from '../config/index.jsx';

export const handleTokenCheck = () => {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");

  if (tokenFromUrl) {
    localStorage.setItem(Config.AUTH_TOKEN, tokenFromUrl);
    window.history.replaceState({}, "", window.location.pathname);
  }

  const token = localStorage.getItem(Config.AUTH_TOKEN);

  return token;
};
