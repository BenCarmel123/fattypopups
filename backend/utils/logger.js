import { getTimestamp } from './time.js';

const formatMessage = (level, message, data) => {
  const timestamp = getTimestamp();
  return data ? `[${level}] ${timestamp}\n${message} ${JSON.stringify(data)}` : `[${level}] ${timestamp}\n${message}`;
};

export const logger = {
  info: (message, data) => console.log(formatMessage('INFO', message, data)),
  error: (message, error) => console.error(formatMessage('ERROR', message, error)),
  warn: (message, data) => console.warn(formatMessage('WARN', message, data)),
  debug: (message, data) => console.log(formatMessage('DEBUG', message, data)),
};
