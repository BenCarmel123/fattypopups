import {
  getEventsWithDetails,
  orchestrateEventCreate,
  orchestrateEventUpdate,
  deleteEvents
} from '../services/orchestrator/index.js';
import { logger } from '../utils/logger.js';

export const getEvents = async (_req, res) => {
  try {
    const events = await getEventsWithDetails(false);
    res.json(events);
  } catch (err) {
    logger.error("HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getDraftEvents = async (_req, res) => {
  try {
    const events = await getEventsWithDetails(true);
    res.json(events);
  } catch (err) {
    logger.error("HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const newEvent = await orchestrateEventCreate(req.body, req.file);
    res.json(newEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await orchestrateEventUpdate(req.params.id, req.body, req.file);
    res.json(updatedEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteEventsByTitles = async (req, res) => {
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
};
