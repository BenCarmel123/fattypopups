import express from 'express';
import { getEventsWithDetails } from '../services/database/crud/get.js';
import { createEventWithRelations } from '../services/database/crud/create.js';
import { updateEventWithRelations } from '../services/database/crud/update.js';
import { deleteEventsWithCleanup } from '../services/database/crud/delete.js';
// Multer imports
import { upload, uploadMemory } from '../config/instances.js';

const eventRouter = express.Router();

// Fetch all events
eventRouter.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.includeDrafts ? true : false;
    const events = await getEventsWithDetails(isAdmin);
    res.json(events);
  } catch (err) {
    console.log("[ERROR] HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add new event
eventRouter.post('/', upload.single('poster'), async (req, res) => {
  try {
    const newEvent = await createEventWithRelations(req.body, req.file);
    res.json(newEvent);
  } catch (err) {
    console.log('[ERROR] HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event with image overwrite + embedding update
eventRouter.put('/:id', uploadMemory.single('poster'), async (req, res) => {
  try {
    const updatedEvent = await updateEventWithRelations(req.params.id, req.body, req.file);
    res.json(updatedEvent);
  } catch (err) {
    console.log('[ERROR] HTTP Error:', err);
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
    const result = await deleteEventsWithCleanup(titles);
    res.json(result);
  } catch (err) {
    console.log('[ERROR] HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default eventRouter;
