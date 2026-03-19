import { vi } from 'vitest';

vi.mock('#config/index.js', () => ({ supabase: {} }));
vi.mock('../../../services/entities/linking/operations.js', () => ({
  unlinkChefsFromEvent: vi.fn(),
  linkChefsToEvent: vi.fn(),
}));

const { createChef } = await import('../../../services/entities/chef/operations.js');

describe('createChef', () => {
  it('throws when name or instagram_handle is missing', async () => {
    await expect(createChef('', '@handle')).rejects.toThrow('Chef name and instagram_handle are required');
    await expect(createChef('Chef A', '')).rejects.toThrow('Chef name and instagram_handle are required');
  });
});
