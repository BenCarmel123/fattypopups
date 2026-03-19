import { vi } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../../services/agent/generateDraft.js', () => ({
  generateDraft: vi.fn().mockResolvedValue({ title: 'Draft Event', is_draft: true }),
}));

vi.mock('../../services/s3/draftUpload.js', () => ({
  uploadDraftImages: vi.fn().mockResolvedValue({ posterUrl: null, contextUrl: null }),
}));

vi.mock('../../config/middleware/isAuthorized.js', () => ({
  isAuthorized: (req, res, next) => next(),
}));

vi.mock('../../config/middleware/multer.js', () => ({
  uploadMemory: { fields: () => (req, res, next) => next() },
}));

const { default: agentRouter } = await import('../../routes/draft.js');

const app = express();
app.use(express.json());
app.use('/agent', agentRouter);

describe('POST /agent/draft', () => {
  it('returns 400 when prompt is missing', async () => {
    const res = await request(app).post('/agent/draft').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('A non-empty prompt is required');
  });
});
