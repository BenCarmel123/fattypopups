import { uploadDraftImages } from '../services/s3/draftUpload.js';
import { publishDraftJob } from '../services/queue/publish.js';
import { logger } from '../utils/logger.js';
import { DraftBodySchema } from '../schemas/draft.schema.js';

export const createDraft = async (req, res) => {
  const parsed = DraftBodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'A non-empty prompt is required' });

  const { prompt } = parsed.data;

  try {
    logger.info('[DRAFT] Uploading images');
    const { posterUrl, contextUrl } = await uploadDraftImages(
      req.files?.poster?.[0] ?? null,
      req.files?.context_image?.[0] ?? null,
    );
    logger.info('[DRAFT] Images uploaded');
    await publishDraftJob({ prompt, posterUrl, contextUrl });
    logger.info('[DRAFT] Draft job queued');
    return res.status(202).json({ message: 'Draft queued' });
  } catch (err) {
    logger.error('[ERROR] Draft or event creation failed:', err.message || err);
    logger.error('[ERROR] Stack trace:', err.stack);
    return res.status(500).json({ error: 'Draft or event creation failed' });
  }
};