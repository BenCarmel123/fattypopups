import { vi } from 'vitest';

vi.mock('../../../config/index.js', () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({
      data: [{ description: 'desc A' }, { description: 'desc B' }],
      error: null,
    }),
  },
}));

const { searchSimilarDescriptions } = await import('../../../services/embeddings/search.js');

describe('searchSimilarDescriptions', () => {
  it('returns mapped description strings from rpc result', async () => {
    const result = await searchSimilarDescriptions([0.1, 0.2]);
    expect(result).toEqual(['desc A', 'desc B']);
  });
});
