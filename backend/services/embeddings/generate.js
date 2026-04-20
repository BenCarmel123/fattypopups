import { openai } from "../../config/index.js";
import { logger } from "../../utils/logger.js";
import { llmCall } from "../llm/llmCall.js";

export async function generateEmbedding(description) {
  if (!openai) {
    logger.warn("OpenAI client is not initialized. Skipping embedding creation.");
    return null;
  }
  const model = "text-embedding-3-small";
  const embeddingCall = () => openai.embeddings.create({ model, input: description });
  const embeddingResponse = await llmCall(embeddingCall, { callType: 'embedding', model, prompt: description });
  const embedding = embeddingResponse.data[0].embedding;
  return embedding;
}

export async function generateEmbeddings(englishDescription, hebrewDescription, generateEnglish = true, generateHebrew = true) {
  logger.info(`[EMBEDDING] Starting embedding generation - English: ${generateEnglish} | Hebrew: ${generateHebrew}`);

  const result = {
    english: null,
    hebrew: null
  };

  try {
    const promises = [];

    if (generateEnglish) {
      promises.push(
        generateEmbedding(englishDescription).then(embedding => ({ type: 'english', embedding }))
      );
    }

    if (generateHebrew) {
      promises.push(
        generateEmbedding(hebrewDescription).then(embedding => ({ type: 'hebrew', embedding }))
      );
    }

    if (promises.length > 0) {
      const results = await Promise.all(promises);

      results.forEach(({ type, embedding }) => {
        result[type] = embedding;
        const status = embedding ? 'SUCCESS' : 'NULL';
        const lang = type === 'english' ? 'English' : 'Hebrew';
        logger.info(`[EMBEDDING] ${lang} embedding generated:`, status);
      });
    }
  } catch (e) {
    logger.error(`Embedding generation error: ${e.message}`, e.stack);
    return { english: null, hebrew: null, generationError: true };
  }

  return result;
}

export const generateBothEmbeddings = (en, he) => generateEmbeddings(en, he, true, true);
export const generateChangedEmbeddings = (enChanged, heChanged, en, he) => generateEmbeddings(en, he, enChanged, heChanged);
