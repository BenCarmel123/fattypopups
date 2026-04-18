import { getTimestamp } from './time.js';

const COLORS = {
  INFO:  '\x1b[37m',
  WARN:  '\x1b[33m',
  ERROR: '\x1b[31m',
  DEBUG: '\x1b[90m',
  RESET: '\x1b[0m',
};

const serializeData = (data) => {
  if (data instanceof Error) {
    return `${data.message}\n${data.stack}`;
  }
  return JSON.stringify(data);
};

const formatMessage = (level, message, data) => {
  const timestamp = getTimestamp();
  const color = COLORS[level] ?? COLORS.RESET;
  const base = `${color}[${level}] ${timestamp}\n${message}${COLORS.RESET}`;
  return data != null ? `${base} ${serializeData(data)}` : base;
};

export const logger = {
  info:  (message, data) => console.log(formatMessage('INFO', message, data)),
  error: (message, data) => console.error(formatMessage('ERROR', message, data)),
  warn:  (message, data) => console.warn(formatMessage('WARN', message, data)),
  debug: (message, data) => console.log(formatMessage('DEBUG', message, data)),
};
