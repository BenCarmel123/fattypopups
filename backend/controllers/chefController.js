import { getAllChefs } from '../services/entities/chef/operations.js';
import { logger } from '../utils/logger.js';

export const getChefs = async (_req, res) => {
  try {
    const chefs = await getAllChefs();
    res.json(chefs.map(chef => ({
      name: chef.name,
      instagram: chef.instagram_handle
    })));
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};