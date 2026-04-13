import { uploadToS3 } from '../../s3/upload.js';
import { buildS3Url } from '../../s3/utils.js';
import { logger } from '../../../utils/logger.js';

export async function uploadCroppedPoster(croppedBuffer) {
  if (!croppedBuffer) return null;

  const s3_key = `posters/cropped-${Date.now()}.jpg`;
  await uploadToS3(s3_key, { buffer: croppedBuffer, mimetype: 'image/jpeg' });

  const croppedUrl = buildS3Url(s3_key);
  logger.info("[CROP] Cropped poster uploaded:", croppedUrl);
  return croppedUrl;
}
