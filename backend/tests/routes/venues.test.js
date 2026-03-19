import { vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../../services/entities/venue/operations.js', () => ({
  getAllVenues: vi.fn().mockResolvedValue([
    { name: 'Venue X', address: '123 Main St', instagram_handle: '@venuex' },
  ]),
}));

const { default: venueRouter } = await import('../../routes/venues.js');

const app = express();
app.use('/venues', venueRouter);

describe('GET /venues', () => {
  it('returns venues mapped to {name, address, instagram}', async () => {
    const res = await request(app).get('/venues');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { name: 'Venue X', address: '123 Main St', instagram: '@venuex' },
    ]);
  });
});
