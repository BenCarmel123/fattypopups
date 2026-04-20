import { vi } from 'vitest';

const insertMock = vi.fn().mockResolvedValue({ error: null });

vi.mock('../../../services/llm/storage.js', () => ({
  insertLlmCallLog: insertMock,
}));

const { llmCall } = await import('../../../services/llm/llmCall.js');

describe('llmCall', () => {
  it('returns the response and fires a log insert with correct fields', async () => {
    const fakeResponse = { output_text: 'hello', usage: { input_tokens: 10, output_tokens: 20 } };

    const result = await llmCall(() => Promise.resolve(fakeResponse), { callType: 'text', model: 'gpt-4o' });

    expect(result).toBe(fakeResponse);
    await vi.waitFor(() => expect(insertMock).toHaveBeenCalledOnce());
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      call_type: 'text',
      model: 'gpt-4o',
      input_tokens: 10,
      output_tokens: 20,
      error: null,
    }));
  });
});
