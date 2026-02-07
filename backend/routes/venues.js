import express from 'express';
import { getAllVenues } from '../services/database/entities/venue/operations.js';

const venueRouter = express.Router();

// Get all venues with distinct names, addresses, and instagrams
venueRouter.get('/', async (req, res) => {
  try {
    const venues = await getAllVenues();

    // Transform to frontend-friendly format
    res.json({
      names: venues.map(venue => venue.name),
      addresses: venues.map(venue => venue.address),
      instagrams: venues.map(venue => venue.instagram_handle)
    });
  } catch (err) {
    console.log('[ERROR] HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default venueRouter;
