import { vi } from 'vitest';

const insertMock = vi.fn().mockResolvedValue({ error: null });
const supabaseMock = {
  from: vi.fn().mockReturnValue({ insert: insertMock }),
};

vi.mock('#config/index.js', () => ({ supabase: supabaseMock }));

const { linkChefsToEvent } = await import('../../../services/entities/linking/operations.js');

describe('linkChefsToEvent', () => {
  it('skips insert when chefIds is empty', async () => {
    await linkChefsToEvent(1, []);
    expect(insertMock).not.toHaveBeenCalled();
  });
});
