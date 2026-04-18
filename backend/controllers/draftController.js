import { uploadDraftImages } from '../services/s3/draftUpload.js';
import { publishDraftJob } from '../services/queue/publish.js';
import { insertEvent } from '../services/entities/event/operations.js';
import { invalidateEventsCache } from '../services/cache/invalidation.js';
import { logger } from '../utils/logger.js';
import { DraftBodySchema } from '../schemas/draft.schema.js';

export const createDraft = async (req, res, next) => {
  const parsed = DraftBodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'A non-empty prompt is required' });

  const { prompt, toCrop } = parsed.data;

  try {
    logger.info('[DRAFT] Uploading images');
    const { posterUrl, contextUrl } = await uploadDraftImages(
      req.files?.poster?.[0] ?? null,
      req.files?.context_image?.[0] ?? null,
    );
    logger.info('[DRAFT] Images uploaded');
    const placeholder = await insertEvent({ title: prompt, is_draft: true, status: 'processing' });
    await invalidateEventsCache();
    logger.info('[DRAFT] Placeholder draft created with ID:', placeholder.id);
    await publishDraftJob({ prompt, posterUrl, contextUrl, draftId: placeholder.id, toCrop });
    logger.info('[DRAFT] Draft job queued');
    return res.status(202).json({ message: 'Draft queued' });
  } catch (err) {
    next(err);
  }
};
