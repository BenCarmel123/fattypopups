import { vi } from 'vitest';

const mockSend = vi.fn().mockResolvedValue({ MessageId: 'test-message-id' });

vi.mock('../../../config/index.js', () => ({
  sqs: { send: mockSend },
}));

const { publishDraftJob } = await import('../../../services/queue/publish.js');

describe('publishDraftJob', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends a correctly shaped SQS message with all draft fields', async () => {
    const input = { prompt: 'test popup', posterUrl: 'http://img.jpg', contextUrl: 'http://ctx.jpg', draftId: 42 };

    await publishDraftJob(input);

    expect(mockSend).toHaveBeenCalledOnce();
    const command = mockSend.mock.calls[0][0];
    expect(command.input.QueueUrl).toBe(process.env.AWS_DRAFT_QUEUE_URL);
    expect(JSON.parse(command.input.MessageBody)).toEqual(input);
  });

  it('propagates SQS errors to the caller', async () => {
    mockSend.mockRejectedValueOnce(new Error('SQS unavailable'));

    await expect(publishDraftJob({ prompt: 'x', posterUrl: null, contextUrl: null, draftId: 1 }))
      .rejects.toThrow('SQS unavailable');
  });
});
