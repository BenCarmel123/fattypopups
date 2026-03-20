import { getAllVenues } from '../services/entities/venue/operations.js';
import { logger } from '../utils/logger.js';

export const getVenues = async (_req, res) => {
  try {
    const venues = await getAllVenues();
    res.json(venues.map(venue => ({
      name: venue.name,
      address: venue.address,
      instagram: venue.instagram_handle
    })));
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};