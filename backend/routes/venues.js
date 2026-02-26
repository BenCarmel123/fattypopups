import express from 'express';
import { getAllVenues } from '../services/entities/venue/operations.js';
import { logger } from "../utils/logger.js";

const venueRouter = express.Router();

// Get all venues with distinct names, addresses, and instagrams
venueRouter.get('/', async (req, res) => {
  try {
    const venues = await getAllVenues();

    // Return unified venue objects with name, address, and instagram
    res.json(venues.map(venue => ({
      name: venue.name,
      address: venue.address,
      instagram: venue.instagram_handle
    })));
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default venueRouter;
