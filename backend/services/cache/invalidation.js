import { redis } from '../../config/index.js';

export async function invalidateEventsCache() {
  await Promise.all([
    redis.del('events:public'),
    redis.del('events:admin')
  ]);
}
