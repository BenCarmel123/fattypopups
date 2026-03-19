import { vi } from 'vitest';

vi.mock('#config/index.js', () => ({ supabase: {} }));

const { upsertVenue } = await import('../../../services/entities/venue/operations.js');

describe('upsertVenue', () => {
  it('throws when required fields are missing', async () => {
    await expect(upsertVenue('', '123 Main St', '@venue')).rejects.toThrow('Venue name, address, and instagram_handle are required');
  });
});
