// Backend server setup for FattyPopups
import express from 'express';
import cors from 'cors';
import dns from 'dns';

// Ensure IPv4 is preferred
dns.setDefaultResultOrder('ipv4first');
import 'dotenv/config';

// Multer imports
import { upload, uploadMemory } from './config/multerConfig.js';

// Service imports
import { getEvents } from './services/events/getEvents.js';
import { createEvent } from './services/events/createEvent.js';
import { updateEvent } from './services/events/updateEvent.js';
import { deleteEvent } from './services/events/deleteEvent.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[DEBUG] - Server running on port ${PORT}`);
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_LOCAL_URL,
    process.env.FRONTEND_PROD_URL,
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] - Incoming ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send(' FattyPopups backend is running!');
});

// Routes

// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const isAdmin = req.query.includeDrafts? true : false
    const events = await getEvents(isAdmin);
    res.json(events);
  } catch (err) {
    console.log("[ERROR] - HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add new event
app.post('/api/events', upload.single("poster"), async (req, res) => {
  try {
    const newEvent = await createEvent(req.body, req.file);
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event with image overwrite + embedding update
app.put('/api/events/:id', uploadMemory.single("poster"), async (req, res) => {
  try {
    const updatedEvent = await updateEvent(req.params.id, req.body, req.file);
    res.json(updatedEvent);
  } catch (err) {
    console.log("[ERROR] - HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete events by titles
app.delete('/api/events', async (req, res) => {
  const { titles } = req.body;

  if (!Array.isArray(titles) || titles.length === 0) {
    return res.status(400).json({ error: "Titles must be a non-empty array" });
  }
  try {
    const result = await deleteEvent(titles);
    res.json(result);
  } catch (err) {
    console.log("[ERROR] - HTTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});


