import { vi } from 'vitest';

const supabaseMock = {
  from: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ error: null }),
};

vi.mock('#config/index.js', () => ({ supabase: supabaseMock, TABLES: { EVENTS: 'events_new' } }));
vi.mock('../../../services/entities/venue/operations.js', () => ({ upsertVenue: vi.fn() }));

const { deleteEventById } = await import('../../../services/entities/event/operations.js');

describe('deleteEventById', () => {
  it('returns a success message with the deleted id', async () => {
    const result = await deleteEventById('abc-123');
    expect(result).toEqual({ message: 'Event deleted successfully', deleted: 'abc-123' });
  });
});
