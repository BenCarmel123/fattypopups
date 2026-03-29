import { vi } from 'vitest';

const mockLlmOutput = (overrides = {}) => ({
  event_title: 'Test Popup',
  english_description: 'A great popup event.',
  hebrew_description: 'אירוע פופ-אפ נהדר.',
  chef_names: ['Chef A'],
  venue_name: 'Venue X',
  start_datetime: '2024-06-01',
  end_datetime: '2024-06-01',
  ...overrides,
});

vi.mock('../../../services/draft/generate/vision/visionCall.js', () => ({
  analyzeImage: vi.fn().mockResolvedValue({
    extractedText: '',
    cropCoordinates: null,
  }),
}));

vi.mock('../../../services/draft/generate/text/similaritySearch.js', () => ({
  fetchStyleExamples: vi.fn().mockResolvedValue(''),
}));

vi.mock('../../../services/draft/generate/text/textCall.js', () => ({
  generateDraftDetails: vi.fn().mockResolvedValue(mockLlmOutput()),
}));

vi.mock('../../../services/draft/image/crop.js', () => ({
  cropPoster: vi.fn().mockResolvedValue(null),
}));

vi.mock('../../../services/draft/image/upload.js', () => ({
  uploadCroppedPoster: vi.fn().mockResolvedValue(null),
}));

vi.mock('../../../services/draft/enrich/formatDraft.js', () => ({
  formatDraft: vi.fn().mockResolvedValue({
    chefNames: ['Chef A'],
    chefInstagrams: '@chefa',
    venueName: 'Venue X',
    venueInstagram: '@venuex',
    venueAddress: '123 Main St',
    english_description: 'A great popup event.',
    hebrew_description: 'אירוע פופ-אפ נהדר.',
  }),
}));

const { orchestrateDraft } = await import('../../../services/draft/orchestrateDraft.js');
const { generateDraftDetails } = await import('../../../services/draft/generate/text/textCall.js');
const { formatDraft } = await import('../../../services/draft/enrich/formatDraft.js');

describe('orchestrateDraft', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a fully shaped draft object', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await orchestrateDraft('some prompt', 'http://poster.url');
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
    const result = await orchestrateDraft('prompt');
    expect(result.is_draft).toBe(true);
  });

  it('uses ontopo URL for reservation_url', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await orchestrateDraft('prompt');
    expect(result.reservation_url).toBe('https://ontopo.com/he/il');
  });

  it('uses *** for missing venue instagram', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    formatDraft.mockResolvedValueOnce({
      chefNames: ['Chef A'],
      chefInstagrams: '@chefa',
      venueName: 'Venue X',
      venueInstagram: '***',
      venueAddress: '123 Main St',
      english_description: 'A great popup event.',
      hebrew_description: 'אירוע פופ-אפ נהדר.',
    });
    const result = await orchestrateDraft('prompt');
    expect(result.venue_instagram).toBe('***');
  });

  it('uses *** for missing venue address', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    formatDraft.mockResolvedValueOnce({
      chefNames: ['Chef A'],
      chefInstagrams: '@chefa',
      venueName: 'Venue X',
      venueInstagram: '@venuex',
      venueAddress: '***',
      english_description: 'A great popup event.',
      hebrew_description: 'אירוע פופ-אפ נהדר.',
    });
    const result = await orchestrateDraft('prompt');
    expect(result.venue_address).toBe('***');
  });

  it('joins multiple chef names with a comma', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput({ chef_names: ['Chef A', 'Chef B'] }));
    formatDraft.mockResolvedValueOnce({
      chefNames: ['Chef A', 'Chef B'],
      chefInstagrams: '@chefa,@chefb',
      venueName: 'Venue X',
      venueInstagram: '@venuex',
      venueAddress: '123 Main St',
      english_description: 'A great popup event.',
      hebrew_description: 'אירוע פופ-אפ נהדר.',
    });
    const result = await orchestrateDraft('prompt');
    expect(result.chef_names).toBe('Chef A,Chef B');
    expect(result.chef_instagrams).toBe('@chefa,@chefb');
  });

  it('uses *** for missing chef instagram', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    formatDraft.mockResolvedValueOnce({
      chefNames: ['Chef A'],
      chefInstagrams: '***',
      venueName: 'Venue X',
      venueInstagram: '@venuex',
      venueAddress: '123 Main St',
      english_description: 'A great popup event.',
      hebrew_description: 'אירוע פופ-אפ נהדר.',
    });
    const result = await orchestrateDraft('prompt');
    expect(result.chef_instagrams).toBe('***');
  });

  it('falls back to today for missing start_datetime', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput({ start_datetime: null }));
    const today = new Date().toISOString().split('T')[0];
    const result = await orchestrateDraft('prompt');
    expect(result.start_datetime).toBe(today);
  });

  it('passes posterUrl as null when not provided', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput());
    const result = await orchestrateDraft('prompt');
    expect(result.poster).toBeNull();
  });

  it('handles chef_names as a string (not array) from LLM', async () => {
    generateDraftDetails.mockResolvedValueOnce(mockLlmOutput({ chef_names: 'Chef A' }));
    formatDraft.mockResolvedValueOnce({
      chefNames: ['Chef A'],
      chefInstagrams: '@chefa',
      venueName: 'Venue X',
      venueInstagram: '@venuex',
      venueAddress: '123 Main St',
      english_description: 'A great popup event.',
      hebrew_description: 'אירוע פופ-אפ נהדר.',
    });
    const result = await orchestrateDraft('prompt');
    expect(result.chef_names).toBe('Chef A');
  });
});
