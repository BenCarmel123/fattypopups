import { vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../../services/orchestrator/index.js', () => ({
  getEventsWithDetails: vi.fn().mockResolvedValue([{ id: 1, title: 'Test Event' }]),
  orchestrateEventCreate: vi.fn().mockResolvedValue({ id: 2, title: 'New Event' }),
  orchestrateEventUpdate: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Event' }),
  deleteEvent: vi.fn().mockResolvedValue({ deleted: 1 }),
}));

vi.mock('../../config/middleware/isAuthorized.js', () => ({
  isAuthorized: (_req, _res, next) => next(),
}));

vi.mock('../../config/index.js', () => ({
  uploadMemory: { single: () => (_req, _res, next) => next() },
}));

const { default: eventRouter } = await import('../../routes/events.js');

const app = express();
app.use(express.json());
app.use('/events', eventRouter);

describe('DELETE /events/:id', () => {
  it('returns 200 with deleted id when event exists', async () => {
    const res = await request(app).delete('/events/123');
    expect(res.status).toBe(200);
  });
});
