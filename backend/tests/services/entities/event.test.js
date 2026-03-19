import { vi } from 'vitest';

const supabaseMock = {
  from: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  in: vi.fn().mockResolvedValue({ error: null }),
};

vi.mock('#config/index.js', () => ({ supabase: supabaseMock }));
vi.mock('../../../services/entities/venue/operations.js', () => ({ upsertVenue: vi.fn() }));

const { deleteEventsByTitles } = await import('../../../services/entities/event/operations.js');

describe('deleteEventsByTitles', () => {
  it('returns a success message with deleted titles', async () => {
    const result = await deleteEventsByTitles(['Event A', 'Event B']);
    expect(result).toEqual({ message: 'Events deleted successfully', deleted: ['Event A', 'Event B'] });
  });
});
