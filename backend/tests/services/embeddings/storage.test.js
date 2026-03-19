import { vi } from 'vitest';

vi.mock('#config/index.js', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockRejectedValue(new Error('DB error')),
        }),
      }),
    }),
  },
}));

const { upsertEventEmbeddings } = await import('../../../services/embeddings/storage/operations.js');

describe('upsertEventEmbeddings', () => {
  it('returns embeddingError when DB insert fails', async () => {
    const result = await upsertEventEmbeddings({
      toPublish: true,
      alreadyPublished: false,
      englishEmbedding: [0.1],
      hebrewEmbedding: [0.2],
      englishDescription: 'en',
      hebrewDescription: 'he',
      chefNames: 'Chef A',
      currentEnglishId: null,
      currentHebrewId: null,
    });
    expect(result.embeddingError).toBe(true);
  });
});
