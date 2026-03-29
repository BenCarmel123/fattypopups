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
  const parsed = EventBodySchema.safeParse(req.body);
  if (!parsed.success) {
    logger.error('Schema validation failed:', JSON.stringify(parsed.error.issues, null, 2));
    return res.status(400).json({ error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
  }

  try {
    const newEvent = await orchestrateEventCreate(parsed.data, req.file);
    res.json(newEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateEvent = async (req, res) => {
  const parsed = EventBodySchema.safeParse(req.body);
  if (!parsed.success) {
    logger.error('Schema validation failed:', JSON.stringify(parsed.error.issues, null, 2));
    return res.status(400).json({ error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
  }

  try {
    const updatedEvent = await orchestrateEventUpdate(req.params.id, parsed.data, req.file);
    res.json(updatedEvent);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteEventsByTitles = async (req, res) => {
  const parsed = DeleteBodySchema.safeParse(req.body);
  if (!parsed.success) {
    logger.error('Schema validation failed:', JSON.stringify(parsed.error.issues, null, 2));
    return res.status(400).json({ error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
  }

  try {
    const deleted = await deleteEvents(parsed.data.titles);
    res.json(deleted);
  } catch (err) {
    logger.error('HTTP Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
