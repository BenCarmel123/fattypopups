import { vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../../services/entities/chef/operations.js', () => ({
  getAllChefs: vi.fn().mockResolvedValue([
    { name: 'Chef A', instagram_handle: '@chefa' },
    { name: 'Chef B', instagram_handle: '@chefb' },
  ]),
}));

const { default: chefRouter } = await import('../../routes/chefs.js');

const app = express();
app.use('/chefs', chefRouter);

describe('GET /chefs', () => {
  it('returns chefs mapped to {name, instagram}', async () => {
    const res = await request(app).get('/chefs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { name: 'Chef A', instagram: '@chefa' },
      { name: 'Chef B', instagram: '@chefb' },
    ]);
  });
});
