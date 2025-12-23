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
import { google } from 'googleapis';
import session from 'express-session';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[DEBUG] - Server running on port ${PORT}`);
});

// Initialize Google Auth
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

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

// Session Middleware
app.use(session({
  name: 'fatty.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,        // set true in production (HTTPS)
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));


// TODO - Move routes to separate file

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

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
  });

  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const validateEmail = (email) => {
  const adminEmails = [
    process.env.BEN_EMAIL.toLowerCase(),
    process.env.HALLIE_EMAIL.toLowerCase()
  ].filter(Boolean);

  return adminEmails.includes(email);
}
  const code = req.query.code;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;

  console.log('[DEBUG] Logged in as:', email);

  const isAdmin = validateEmail(email)
  console.log('[DEBUG] isAdmin:', isAdmin);
  if (isAdmin) {
    req.session.user = 
    {
      email,
      provider: 'google'
    };
    res.redirect(`${process.env.FRONTEND_LOCAL_URL}/${process.env.ADMIN_ROUTE}`);
  }
  else {
    res.redirect(process.env.FRONTEND_LOCAL_URL)
  }
});

app.get('/api/me', async (req,res) => {
  if (req.session?.user) {
    return res.json({
      authenticated: true,
      user: {
        email: req.session.user.email
      }
    });
  }
  res.json({ authenticated: false });
});
