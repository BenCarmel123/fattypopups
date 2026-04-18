import { Router } from 'express';
import { supabase } from '../config/index.js';

const healthRouter = Router();

healthRouter.get('/status', async (_req, res) => {
  try {
    const { error } = await supabase.from('events').select('id').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', db: 'ok' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
});

export default healthRouter;
