import { isTrue } from '../../utils/isTrue.js';

describe('isTrue', () => {
  it('returns true only for boolean true and string "true"', () => {
    expect(isTrue(true)).toBe(true);
    expect(isTrue('true')).toBe(true);
    expect(isTrue(false)).toBe(false);
    expect(isTrue(1)).toBe(false);
    expect(isTrue(undefined)).toBe(false);
  });
});
