import Redis from 'ioredis';
import { logger } from "../../utils/logger.js";

export const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

if (redis) {
  redis.on('error', err => logger.error("[Redis] Redis Client Error - " + err));
}

