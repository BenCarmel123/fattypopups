import { redis } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export async function invalidateEventsCache() {
  await Promise.all([
    redis.del('events:public'),
    redis.del('events:admin')
  ]);
  logger.info('[Cache] Invalidated events:public and events:admin');
}
