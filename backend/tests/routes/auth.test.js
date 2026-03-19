import { vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

vi.mock('../../config/index.js', () => ({
  oauth2Client: { generateAuthUrl: vi.fn().mockReturnValue('http://google.com/auth') },
}));

const { default: authRouter } = await import('../../routes/auth.js');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

const JWT_SECRET = 'test-secret';

describe('GET /auth/check', () => {
  it('returns authenticated: false when no token is provided', async () => {
    const res = await request(app).get('/auth/check');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ authenticated: false });
  });
});
