import { vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../../services/orchestrator/index.js', () => ({
  getEventsWithDetails: vi.fn().mockResolvedValue([{ id: 1, title: 'Test Event' }]),
  orchestrateEventCreate: vi.fn().mockResolvedValue({ id: 2, title: 'New Event' }),
  orchestrateEventUpdate: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Event' }),
  deleteEvents: vi.fn().mockResolvedValue({ deleted: 1 }),
}));

vi.mock('../../config/middleware/isAuthorized.js', () => ({
  isAuthorized: (req, res, next) => next(),
}));

vi.mock('../../config/index.js', () => ({
  uploadMemory: { single: () => (req, res, next) => next() },
}));

const { default: eventRouter } = await import('../../routes/events.js');

const app = express();
app.use(express.json());
app.use('/events', eventRouter);

describe('DELETE /events', () => {
  it('returns 400 when titles array is empty', async () => {
    const res = await request(app).delete('/events').send({ titles: [] });
    expect(res.status).toBe(400);
  });
});
