import { vi } from 'vitest';

vi.mock('../../../config/index.js', () => ({
  redis: { del: vi.fn().mockResolvedValue(1) },
}));

const { invalidateEventsCache } = await import('../../../services/cache/invalidation.js');
const { redis } = await import('../../../config/index.js');

describe('invalidateEventsCache', () => {
  it('deletes both events:public and events:admin keys from redis', async () => {
    await invalidateEventsCache();
    expect(redis.del).toHaveBeenCalledWith('events:public');
    expect(redis.del).toHaveBeenCalledWith('events:admin');
  });
});
