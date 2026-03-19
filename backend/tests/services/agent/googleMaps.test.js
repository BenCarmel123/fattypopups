import { vi } from 'vitest';

global.fetch = vi.fn().mockResolvedValue({
  json: vi.fn().mockResolvedValue({
    places: [{ formattedAddress: 'Rothschild Blvd 22, Tel Aviv' }],
  }),
});

const { fetchVenueAddress } = await import('../../../services/agent/google/googleMaps.js');

describe('fetchVenueAddress', () => {
  it('returns only the street and number from the formatted address', async () => {
    const result = await fetchVenueAddress('Some Venue');
    expect(result).toBe('Rothschild Blvd 22');
  });
});
