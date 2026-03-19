import { vi } from 'vitest';

const mockLlmOutput = (overrides = {}) => JSON.stringify({
  event_title: 'Test Popup',
  english_description: 'A great popup event.',
  chef_names: ['Chef A'],
  venue_name: 'Venue X',
  start_datetime: '2024-06-01',
  end_datetime: '2024-06-01',
  ...overrides,
});

vi.mock('../../../services/agent/llm.js', () => ({
  generateDraftDetails: vi.fn().mockResolvedValue(mockLlmOutput()),
}));

vi.mock('../../../services/agent/enrich.js', () => ({
  enrichEntities: vi.fn().mockResolvedValue({
    chefEntities: [{ instagram_handle: '@chefa' }],
    venueEntity: { instagram_handle: '@venuex', address: '123 Main St' },
  }),
}));

vi.mock('../../../services/agent/google/googleTranslate.js', () => ({
  translate: vi.fn().mockResolvedValue('אירוע פופ-אפ נהדר.'),
}));

const { generateDraft } = await import('../../../services/agent/generateDraft.js');
const { generateDraftDetails } = await import('../../../services/agent/llm.js');
const { enrichEntities } = await import('../../../services/agent/enrich.js');

describe('generateDraft', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a fully shaped draft object', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await generateDraft('some prompt', 'http://poster.url');
    expect(result).toMatchObject({
      title: 'Test Popup',
      english_description: 'A great popup event.',
      hebrew_description: 'אירוע פופ-אפ נהדר.',
      venue_name: 'Venue X',
      is_draft: true,
    });
  });

  it('always sets is_draft to true', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await generateDraft('prompt');
    expect(result.is_draft).toBe(true);
  });

  it('uses *** as placeholder for reservation_url', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await generateDraft('prompt');
    expect(result.reservation_url).toBe('***');
  });

  it('uses *** for missing venue instagram', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    enrichEntities.mockResolvedValueOnce({
      chefEntities: [{ instagram_handle: '@chefa' }],
      venueEntity: { instagram_handle: null, address: '123 Main St' },
    });
    const result = await generateDraft('prompt');
    expect(result.venue_instagram).toBe('***');
  });

  it('uses *** for missing venue address', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    enrichEntities.mockResolvedValueOnce({
      chefEntities: [{ instagram_handle: '@chefa' }],
      venueEntity: { instagram_handle: '@venuex', address: null },
    });
    const result = await generateDraft('prompt');
    expect(result.venue_address).toBe('***');
  });

  it('joins multiple chef names with a comma', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput({ chef_names: ['Chef A', 'Chef B'] }));
    enrichEntities.mockResolvedValueOnce({
      chefEntities: [{ instagram_handle: '@chefa' }, { instagram_handle: '@chefb' }],
      venueEntity: { instagram_handle: '@venuex', address: '123 Main St' },
    });
    const result = await generateDraft('prompt');
    expect(result.chef_names).toBe('Chef A,Chef B');
    expect(result.chef_instagrams).toBe('@chefa,@chefb');
  });

  it('uses *** for missing chef instagram', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    enrichEntities.mockResolvedValueOnce({
      chefEntities: [{ instagram_handle: null }],
      venueEntity: { instagram_handle: '@venuex', address: '123 Main St' },
    });
    const result = await generateDraft('prompt');
    expect(result.chef_instagrams).toBe('***');
  });

  it('falls back to today for missing start_datetime', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput({ start_datetime: null }));
    const today = new Date().toISOString().split('T')[0];
    const result = await generateDraft('prompt');
    expect(result.start_datetime).toBe(today);
  });

  it('passes posterUrl as null when not provided', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await generateDraft('prompt');
    expect(result.poster).toBeNull();
  });

  it('throws when LLM returns invalid JSON', async () => {
    generateDraftDetails.mockResolvedValueOnce('not valid json {{');
    await expect(generateDraft('prompt')).rejects.toThrow('LLM returned invalid JSON');
  });

  it('throws when LLM returns empty string', async () => {
    generateDraftDetails.mockResolvedValueOnce('');
    await expect(generateDraft('prompt')).rejects.toThrow('LLM returned invalid JSON');
  });

  it('handles chef_names as a string (not array) from LLM', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput({ chef_names: 'Chef A' }));
    const result = await generateDraft('prompt');
    expect(result.chef_names).toBe('Chef A');
  });
});
