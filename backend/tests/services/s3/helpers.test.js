import { createSlug } from '../../../services/s3/utils.js';

describe('createSlug', () => {
  it('returns null for falsy input', () => {
    expect(createSlug('')).toBeNull();
    expect(createSlug(null)).toBeNull();
  });
});
