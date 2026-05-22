import { withRetry } from '../../../utils/retry/withRetry.js';

describe('withRetry', () => {
  it('retries a failing function and returns the result when it eventually succeeds', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw Object.assign(new Error('network error'), { code: 'ECONNREFUSED' });
      return 'ok';
    };

    const result = await withRetry(fn, {
      maxRetries: 3,
      baseDelayMs: 1,
      isRetryable: () => true,
    });

    expect(result).toBe('ok');
    expect(attempts).toBe(3);
  });

  it('throws immediately without retrying when the error is non-retryable', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      throw Object.assign(new Error('bad request'), { status: 400 });
    };

    await expect(
      withRetry(fn, {
        maxRetries: 3,
        baseDelayMs: 1,
        isRetryable: () => false,
      })
    ).rejects.toThrow('bad request');

    expect(attempts).toBe(1);
  });
});
