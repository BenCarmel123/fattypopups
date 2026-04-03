import { vi } from 'vitest';

const mockSqsSend = vi.fn().mockResolvedValue({});
const mockOrchestrateDraft = vi.fn();
const mockOrchestrateEventUpdate = vi.fn().mockResolvedValue({});
const mockBuildMetadata = vi.fn().mockReturnValue({ venue: 'Test Venue' });

vi.mock('../../config/index.js', () => ({
  sqs: { send: mockSqsSend },
}));

vi.mock('../../services/draft/orchestrateDraft.js', () => ({
  orchestrateDraft: mockOrchestrateDraft,
}));

vi.mock('../../services/orchestrator/crud/update.js', () => ({
  orchestrateEventUpdate: mockOrchestrateEventUpdate,
}));

vi.mock('../../services/orchestrator/utils/metadata.js', () => ({
  buildMetadata: mockBuildMetadata,
}));

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

const { processMessage } = await import('../../worker/draftConsumer.js');

describe('processMessage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('orchestrates draft, updates DB, and deletes message — falling back to prompt when title is empty', async () => {
    mockOrchestrateDraft.mockResolvedValue({
      title: '',
      venue_name: 'HO HO',
      venue_instagram: '@hoho',
      venue_address: 'Tel Aviv',
      chef_names: 'Eyal Shani',
      chef_instagrams: '@eyal',
      english_description: 'A great dinner.',
      hebrew_description: 'ארוחה נהדרת.',
      poster: 'http://s3.example.com/poster.jpg',
      is_draft: true,
    });

    const message = {
      Body: JSON.stringify({ prompt: 'Eyal Shani at HO HO', posterUrl: 'http://img.jpg', contextUrl: null, draftId: 42 }),
      ReceiptHandle: 'receipt-abc',
    };

    await processMessage(message);

    expect(mockOrchestrateDraft).toHaveBeenCalledWith('Eyal Shani at HO HO', 'http://img.jpg', null);
    expect(mockBuildMetadata).toHaveBeenCalledWith('HO HO', '@hoho', 'Tel Aviv', 'Eyal Shani', '@eyal');
    expect(mockOrchestrateEventUpdate).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ title: 'Eyal Shani at HO HO', status: 'done' }),
      null,
    );
    const deleteCall = mockSqsSend.mock.calls.find(([cmd]) => cmd.constructor.name === 'DeleteMessageCommand');
    expect(deleteCall[0].input.ReceiptHandle).toBe('receipt-abc');
  });
});
