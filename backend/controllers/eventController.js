import {
  getEventsWithDetails,
  orchestrateEventCreate,
  orchestrateEventUpdate,
  deleteEvent
} from '../services/orchestrator/index.js';
import { logger } from '../utils/logger.js';
import { EventBodySchema, DraftEventBodySchema } from '../schemas/event.schema.js';
import { isTrue } from '../utils/isTrue.js';

export const getEvents = async (_req, res, next) => {
  try {
    const events = await getEventsWithDetails(false);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

export const getDraftEvents = async (_req, res, next) => {
  try {
    const events = await getEventsWithDetails(true);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  const schema = isTrue(req.body.is_draft) ? DraftEventBodySchema : EventBodySchema;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    logger.error('Schema validation failed:', JSON.stringify(parsed.error.issues, null, 2));
    return res.status(400).json({ error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
  }

  try {
    const newEvent = await orchestrateEventCreate(parsed.data, req.file);
    res.json(newEvent);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req, res, next) => {
  const schema = isTrue(req.body.is_draft) ? DraftEventBodySchema : EventBodySchema;
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    logger.error('Schema validation failed:', JSON.stringify(parsed.error.issues, null, 2));
    return res.status(400).json({ error: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ') });
  }

  try {
    const updatedEvent = await orchestrateEventUpdate(req.params.id, parsed.data, req.file);
    res.json(updatedEvent);
  } catch (err) {
    next(err);
  }
};

export const deleteEventById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing event id' });

  try {
    const result = await deleteEvent(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
