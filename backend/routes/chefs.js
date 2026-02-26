import express from 'express';
import { getAllChefs } from '../services/entities/chef/operations.js';
import { logger } from "../utils/logger.js";

const chefRouter = express.Router();

// Get all chefs with distinct names and instagrams
chefRouter.get('/', async (req, res) => {
  try {
    const chefs = await getAllChefs();

    // Return unified chef objects with name and instagram
    res.json(chefs.map(chef => ({
      name: chef.name,
      instagram: chef.instagram_handle
    })));
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default chefRouter;
