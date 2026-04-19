import { Router } from 'express';
import { supabase, TABLES } from '../config/index.js';
import { healthLimiter } from '../config/middleware/rateLimiter.js';

const healthRouter = Router();

healthRouter.get('/status', healthLimiter, async (_req, res) => {
  try {
    const { _data, error } = await supabase.from(TABLES.EVENTS).select('id').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
});

export default healthRouter;
