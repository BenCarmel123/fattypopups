import { vi } from 'vitest';

global.fetch = vi.fn().mockResolvedValue({
  json: vi.fn().mockResolvedValue({
    data: { translations: [{ translatedText: 'שלום עולם' }] },
  }),
});

const { translate } = await import('../../../services/agent/google/googleTranslate.js');

describe('translate', () => {
  it('returns the translated text from the Google Translate response', async () => {
    const result = await translate('Hello World');
    expect(result).toBe('שלום עולם');
  });
});
