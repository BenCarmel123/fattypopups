const jitter = () => Math.random() * 200;

export const isNetworkError = (err) =>
  err.message?.includes('fetch failed') ||
  err.message?.includes('ECONNREFUSED') ||
  err.message?.includes('ENOTFOUND') ||
  err.message?.includes('ETIMEDOUT') ||
  err.code === 'ECONNREFUSED' ||
  err.code === 'ENOTFOUND' ||
  err.code === 'ETIMEDOUT';

export const isRetryableStatus = (err) => {
  const status = err.status ?? err.statusCode;
  return !status || status === 429 || status >= 500;
};

export async function withRetry(fn, { maxRetries, baseDelayMs, isRetryable }) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const shouldRetry = isRetryable(err) && attempt < maxRetries;
      if (!shouldRetry) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + jitter();
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
