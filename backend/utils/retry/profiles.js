import { isNetworkError, isRetryableStatus } from './withRetry.js';

const networkOr5xx = (err) => isNetworkError(err) || isRetryableStatus(err);
const networkOnly = (err) => isNetworkError(err);

export const RETRY_PROFILES = {
  SUPABASE_READ: {
    maxRetries: 3,
    baseDelayMs: 500,
    isRetryable: networkOr5xx,
  },
  SUPABASE_WRITE: {
    maxRetries: 2,
    baseDelayMs: 500,
    isRetryable: networkOnly,
  },
  LLM_CALL: {
    maxRetries: 2,
    baseDelayMs: 1000,
    isRetryable: networkOr5xx,
  },
  EXTERNAL_FETCH: {
    maxRetries: 2,
    baseDelayMs: 750,
    isRetryable: networkOr5xx,
  },
};
