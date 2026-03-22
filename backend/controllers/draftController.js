import { generateDraft } from '../services/agent/generateDraft.js';
import { uploadDraftImages } from '../services/s3/draftUpload.js';
import { logger } from '../utils/logger.js';

export const createDraft = async (req, res) => {
  const prompt = req.body?.prompt;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'A non-empty prompt is required' });
  }

  try {
    logger.info('[DRAFT] Uploading images');
    const { posterUrl, contextUrl } = await uploadDraftImages(
      req.files?.poster?.[0] ?? null,
      req.files?.context_image?.[0] ?? null,
    );
    logger.info('[DRAFT] Images uploaded');
    const draft = await generateDraft(prompt, posterUrl, contextUrl);
    logger.info('[DRAFT] Draft generated successfully');
    return res.status(200).json({ event: draft });
  } catch (err) {
    logger.error('[ERROR] Draft or event creation failed:', err.message || err);
    logger.error('[ERROR] Stack trace:', err.stack);
    return res.status(500).json({ error: 'Draft or event creation failed' });
  }
};