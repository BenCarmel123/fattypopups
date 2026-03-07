import Redis from 'ioredis';
import { logger } from "../../utils/logger.js";

export const redis = new Redis({ host: 'redis', port: 6379 });

redis.on('error', err => logger.error("[Redis] Redis Client Error - " + err));

