// Backend server setup for FattyPopups
import express from 'express';
import cors from 'cors';
import dns from 'dns';

// Ensure IPv4 is preferred
dns.setDefaultResultOrder('ipv4first');
import 'dotenv-flow/config';

// Import routers 
import eventRouter from './routes/events.js';
import authRouter from './routes/auth.js';
import agentRouter from './routes/draft.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// JSON/TEXT Support
app.use(express.json());
app.use(express.text());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[REQUEST] Incoming ${req.method} ${req.url}\n`);
  next();
});

// For Debugging
app.get('/', (req, res) => {
  res.send(' FattyPopups backend is running!');
});

// Routing
app.use('/api/events', eventRouter);
app.use('/auth', authRouter);
app.use('/agent', agentRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[NETWORK] Server running on port ${PORT}\n`);
});

