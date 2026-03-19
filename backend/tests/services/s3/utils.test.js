import { slugify } from '../../../services/s3/utils.js';

describe('slugify', () => {
  it('lowercases, replaces spaces, strips special chars and edge hyphens', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  hello  ')).toBe('hello');
    expect(slugify('foo   bar')).toBe('foo-bar');
  });
});
