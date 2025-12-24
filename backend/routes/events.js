import express from 'express';
import { getEvents } from '../services/events/getEvents.js';
import { createEvent } from '../services/events/createEvent.js';
import { updateEvent } from '../services/events/updateEvent.js';
import { deleteEvent } from '../services/events/deleteEvent.js';
// Multer imports
import { upload, uploadMemory } from '../config/multerConfig.js';

const eventRouter = express.Router();

// Fetch all events
// Mounted at /api/events in server.js, so use root here
eventRouter.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.includeDrafts ? true : false;
    const events = await getEvents(isAdmin);
    res.json(events);
  } catch (err) {
    console.log("[ERROR] - HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add new event
eventRouter.post('/', upload.single('poster'), async (req, res) => {
  try {
    const newEvent = await createEvent(req.body, req.file);
    res.json(newEvent);
  } catch (err) {
    console.log('[ERROR] - HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event with image overwrite + embedding update
eventRouter.put('/:id', uploadMemory.single('poster'), async (req, res) => {
  try {
    const updatedEvent = await updateEvent(req.params.id, req.body, req.file);
    res.json(updatedEvent);
  } catch (err) {
    console.log('[ERROR] - HTTP Error:', err);
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
    const result = await deleteEvent(titles);
    res.json(result);
  } catch (err) {
    console.log('[ERROR] - HTTP Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default eventRouter;
