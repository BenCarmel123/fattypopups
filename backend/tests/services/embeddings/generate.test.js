import { vi } from 'vitest';

const mockEmbedding = [0.1, 0.2, 0.3];

const openaiMock = {
  embeddings: {
    create: vi.fn().mockResolvedValue({
      data: [{ embedding: mockEmbedding }],
    }),
  },
};

vi.mock('../../../config/index.js', () => ({
  openai: openaiMock,
}));

const { generateEmbeddings } = await import('../../../services/embeddings/generate.js');

describe('generateEmbeddings', () => {
  it('generates both english and hebrew embeddings in parallel by default', async () => {
    const result = await generateEmbeddings('en text', 'he text');
    expect(result.english).toEqual(mockEmbedding);
    expect(result.hebrew).toEqual(mockEmbedding);
    expect(openaiMock.embeddings.create).toHaveBeenCalledTimes(2);
  });
});
