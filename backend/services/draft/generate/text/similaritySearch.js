import { generateEmbedding } from '../../../embeddings/generate.js';
import { searchSimilarDescriptions } from '../../../embeddings/search.js';

export async function fetchStyleExamples(prompt) {
  const promptEmbedding = await generateEmbedding(prompt);
  const similarDescriptions = await searchSimilarDescriptions(promptEmbedding);
  return similarDescriptions.map(d => `- "${d}"`).join('\n');
}
