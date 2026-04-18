const STYLES = {
  INFO:  'color: #aaaaaa',
  WARN:  'color: #f5a623; font-weight: bold',
  ERROR: 'color: #e74c3c; font-weight: bold',
  DEBUG: 'color: #888888',
};

const CONSOLE_METHOD = {
  INFO:  'log',
  WARN:  'warn',
  ERROR: 'error',
  DEBUG: 'log',
};

const serializeData = (data) => {
  if (data instanceof Error) return [data.message, '\n', data.stack];
  return [data];
};

const formatMessage = (level, message, data) => {
  const base = [`%c[${level}] ${message}`, STYLES[level]];
  return data !== undefined ? [...base, ...serializeData(data)] : base;
};

export const logger = {
  info:  (message, data) => console[CONSOLE_METHOD.INFO](...formatMessage('INFO', message, data)),
  warn:  (message, data) => console[CONSOLE_METHOD.WARN](...formatMessage('WARN', message, data)),
  error: (message, data) => console[CONSOLE_METHOD.ERROR](...formatMessage('ERROR', message, data)),
  debug: (message, data) => console[CONSOLE_METHOD.DEBUG](...formatMessage('DEBUG', message, data)),
};
