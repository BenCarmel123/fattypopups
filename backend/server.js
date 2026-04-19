import express from 'express';
import cors from 'cors';
import dns from 'dns';
import { logger } from './utils/logger.js';

dns.setDefaultResultOrder('ipv4first');
import 'dotenv-flow/config';

import * as routers from './routes/index.js';
const { eventRouter, authRouter, draftRouter, chefRouter, venueRouter, healthRouter } = routers;

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.text());

app.use((req, _res, next) => {
  logger.info(`[Request] Incoming ${req.method} ${req.url}`);
  next();
});

app.get('/', (_req, res) => {
  res.send(' FattyPopups backend is running!');
});

app.use('/api/events', eventRouter);
app.use('/api/chefs', chefRouter);
app.use('/api/venues', venueRouter);
app.use('/auth', authRouter);
app.use('/agent', draftRouter);
app.use('/health', healthRouter);

app.use((err, req, res, _next) => {
  logger.error(`[${req.method}] ${req.url}`, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
