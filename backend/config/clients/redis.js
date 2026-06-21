import Redis from 'ioredis';
import { logger } from "../../utils/logger.js";

export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (times) => (times > 5 ? null : Math.min(times * 200, 2000)),
    })
  : null;

if (redis) {
  redis.on('error', err => logger.error("[Redis] Redis Client Error - " + err));
  redis.connect().catch(err => logger.error("[Redis] Initial connection failed - " + err));
}

