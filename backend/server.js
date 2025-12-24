// Backend server setup for FattyPopups
import express from 'express';
import cors from 'cors';
import dns from 'dns';

// Ensure IPv4 is preferred
dns.setDefaultResultOrder('ipv4first');
import 'dotenv/config';
import session from 'express-session';

// Import routers 
import eventRouter from './routes/events.js';
import authRouter from './routes/auth.js';

// Initialize Express app
const app = express();

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

// Session Middleware
app.use(session({
  name: 'fatty.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,       
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// For Debugging
app.get('/', (req, res) => {
  res.send(' FattyPopups backend is running!');
});

app.use('/api/events', eventRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[DEBUG] - Server running on port ${PORT}`);
});

