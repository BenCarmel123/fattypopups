import { resolveEndDatetime } from '../../utils/time.js';

describe('resolveEndDatetime', () => {
  it('returns start when end is before start', () => {
    expect(resolveEndDatetime('2025-03-31T20:00', '2025-03-31T19:00')).toBe('2025-03-31T20:00');
  });
});
