import { vi } from 'vitest';

vi.mock('../../../config/index.js', () => ({
  supabase: {},
  s3: { send: vi.fn() },
}));

const { handleEventImageUpload } = await import('../../../services/s3/upload.js');

describe('handleEventImageUpload', () => {
  it('throws when publishing a draft that has no existing image and no file', async () => {
    const body = { is_draft: false };
    const currentEvent = { is_draft: true, poster: null };
    await expect(handleEventImageUpload(1, body, null, currentEvent))
      .rejects.toThrow('Cannot publish draft: event must have an image.');
  });
});
