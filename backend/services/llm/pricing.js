const PRICING = {
  'gpt-5.4':                  { input: 0.003,  output: 0.012 },
  'gpt-4o':                   { input: 0.0025, output: 0.010 },
  'gpt-4o-mini':              { input: 0.00015, output: 0.0006 },
  'text-embedding-3-small':   { input: 0.00002, output: 0 },
  'text-embedding-3-large':   { input: 0.00013, output: 0 },
};

export function computeCost(model, inputTokens, outputTokens) {
  const rates = PRICING[model];
  if (!rates) return null;
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}
