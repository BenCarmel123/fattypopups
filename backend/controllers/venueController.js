import { getAllVenues } from '../services/entities/venue/operations.js';

export const getVenues = async (_req, res, next) => {
  try {
    const venues = await getAllVenues();
    res.json(venues.map(venue => ({
      name: venue.name,
      address: venue.address,
      instagram: venue.instagram_handle
    })));
  } catch (err) {
    next(err);
  }
};
