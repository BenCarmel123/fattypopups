import {
  getEventsWithDetails,
  orchestrateEventCreate,
  orchestrateEventUpdate,
  deleteEvents
} from '../services/orchestrator/index.js';
import { logger } from '../utils/logger.js';
import { EventBodySchema, DeleteBodySchema } from '../schemas/event.schema.js';

export const getEvents = async (_req, res) => {
  try {
    const events = await getEventsWithDetails(false);
    res.json(events);
  } catch (err) {
    logger.error("HTTP Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDraftEvents = async (_req, res) => {
  try {
    const events = await getEventsWithDetails(true);
    res.json(events);
  } catch (err) {
    logger.error("HTTP Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createEvent = async (req, res) => {
  const check = EventBodySchema.safeParse(req.body);
  if (!check.success) return res.status(400).json({ error: check.error.issues });

  try {
    const newEvent = await orchestrateEventCreate(check.data, req.file);
    res.json(newEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateEvent = async (req, res) => {
  const check = EventBodySchema.safeParse(req.body);
  if (!check.success) return res.status(400).json({ error: check.error.issues });

  try {
    const updatedEvent = await orchestrateEventUpdate(req.params.id, check.data, req.file);
    res.json(updatedEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteEventsByTitles = async (req, res) => {
  const check = DeleteBodySchema.safeParse(req.body);
  if (!check.success) return res.status(400).json({ error: check.error.issues });

  try {
    const deleted = await deleteEvents(check.data.titles);
    res.json(deleted);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
