import express from 'express';
import {
  getEventsWithDetails,
  orchestrateEventCreate,
  orchestrateEventUpdate,
  deleteEvents
} from '../services/database/orchestrator/index.js';
import { logger } from "../utils/logger.js";
// Multer imports
import { uploadMemory } from '../config/index.js';

const eventRouter = express.Router();

// Fetch all events
eventRouter.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.includeDrafts ? true : false;
    const events = await getEventsWithDetails(isAdmin);
    res.json(events);
  } catch (err) {
    logger.error("HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add new event
eventRouter.post('/', uploadMemory.single('poster'), async (req, res) => {
  try {
    const newEvent = await orchestrateEventCreate(req.body, req.file);
    res.json(newEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event with image overwrite + embedding update
eventRouter.put('/:id', uploadMemory.single('poster'), async (req, res) => {
  try {
    const updatedEvent = await orchestrateEventUpdate(req.params.id, req.body, req.file);
    res.json(updatedEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete events by titles
eventRouter.delete('/', async (req, res) => {
  const { titles } = req.body;
  if (!Array.isArray(titles) || titles.length === 0) {
    return res.status(400).json({ error: 'Titles must be a non-empty array' });
  }
  try {
    const result = await deleteEvents(titles);
    res.json(result);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default eventRouter;
