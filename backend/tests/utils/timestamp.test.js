import { getTimestamp } from '../../utils/timestamp.js';

describe('getTimestamp', () => {
  it('returns a zero-padded HH:MM:SS string', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T05:03:07'));
    expect(getTimestamp()).toBe('05:03:07');
    vi.useRealTimers();
  });
});
