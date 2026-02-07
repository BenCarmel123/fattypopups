import express from 'express';
import { getAllChefs } from '../services/database/entities/chef/operations.js';

const chefRouter = express.Router();

// Get all chefs with distinct names and instagrams
chefRouter.get('/', async (req, res) => {
  try {
    const chefs = await getAllChefs();

    // Transform to frontend-friendly format
    res.json({
      names: chefs.map(chef => chef.name),
      instagrams: chefs.map(chef => chef.instagram_handle)
    });
  } catch (err) {
    console.log('[ERROR] HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default chefRouter;
