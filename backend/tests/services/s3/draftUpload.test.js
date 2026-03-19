import { vi } from 'vitest';

vi.mock('../../../services/s3/upload.js', () => ({
  uploadToS3: vi.fn().mockResolvedValue(undefined),
}));

const { uploadDraftImages } = await import('../../../services/s3/draftUpload.js');

describe('uploadDraftImages', () => {
  it('returns null urls when no files are provided', async () => {
    const result = await uploadDraftImages(null, null);
    expect(result).toEqual({ posterUrl: null, contextUrl: null });
  });
});
