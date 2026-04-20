import { logger } from '../../utils/logger.js';
import { computeCost } from './pricing.js';
import { insertLlmCallLog } from './storage.js';

export async function llmCall(call, { callType, model, prompt = null, metadata = null } = {}) {
  const startTime = Date.now();
  let response = null;
  let error = null;

  try {
    response = await call();
    return response;
  } catch (err) {
    error = err.message;
    throw err;
  } finally {
    const latencyMs = Date.now() - startTime;
    const inputTokens = response?.usage?.input_tokens ?? response?.usage?.prompt_tokens ?? 0;
    const outputTokens = response?.usage?.output_tokens ?? response?.usage?.completion_tokens ?? 0;
    const costUsd = computeCost(model, inputTokens, outputTokens);

    insertLlmCallLog({
      call_type: callType,
      model,
      prompt,
      response: response ?? null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs,
      cost_usd: costUsd,
      error,
      metadata,
    }).catch(err => logger.error('[LLM LOG] Fire-and-forget failed:', err.message));
  }
}
