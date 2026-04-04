import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../utils/logger.js', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

const originalEnv = { ...process.env };

global.fetch = vi.fn();

const { fetchInstagramHandle } = await import('../../../services/draft/enrich/google/googleSearch.js');
const { logger } = await import('../../../utils/logger.js');

describe('fetchInstagramHandle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns an instagram handle from organic results', async () => {
    process.env.SERP_API_KEY = 'test-key';
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        organic_results: [
          { link: 'https://www.instagram.com/fattypopups/' },
        ],
      }),
    });

    const result = await fetchInstagramHandle('Fatty Popups');

    expect(result).toBe('@fattypopups');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain('engine=google');
    expect(global.fetch.mock.calls[0][0]).toContain('num=5');
    expect(global.fetch.mock.calls[0][0]).toContain('gl=il');
    expect(global.fetch.mock.calls[0][0]).toContain('site%3Ainstagram.com');
  });

  it('returns null and logs a warning when SERP_API_KEY is missing', async () => {
    delete process.env.SERP_API_KEY;

    const result = await fetchInstagramHandle('Fatty Popups');

    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith('[SERPAPI] SERP_API_KEY not found; skipping Instagram lookup');
  });

  it('returns null and logs when request fails', async () => {
    process.env.SERP_API_KEY = 'test-key';
    global.fetch.mockResolvedValueOnce({ ok: false, status: 429 });

    const result = await fetchInstagramHandle('Fatty Popups');

    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith('[SERPAPI] Request failed with status 429');
  });
});
