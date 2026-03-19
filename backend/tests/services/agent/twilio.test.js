import { vi } from 'vitest';

const createMock = vi.fn().mockResolvedValue({});

vi.mock('../../../config/clients/twilio.js', () => ({
  twilioClient: { messages: { create: createMock } },
}));

const { notifyUsers } = await import('../../../services/twilio/notify.js');

describe('notifyUsers', () => {
  it('calls twilioClient with a message body containing the event title', async () => {
    await notifyUsers('Fat Popup');
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ body: 'check out Fat Popup online' })
    );
  });
});
