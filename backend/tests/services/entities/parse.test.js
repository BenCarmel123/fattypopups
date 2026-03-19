import { normalizeName } from '../../../services/entities/utils/parse.js';

describe('normalizeName', () => {
  it('capitalizes words, handles hyphens, trims whitespace, and rejects non-strings', () => {
    expect(normalizeName('mary-jane watson')).toBe('Mary-Jane Watson');
    expect(normalizeName('  jane  ')).toBe('Jane');
    expect(normalizeName(null)).toBe('');
  });
});
