import sharp from 'sharp';
import { logger } from '../../../utils/logger.js';
import { fetchImageBuffer } from '../../../utils/fetchImageBuffer.js';

export async function cropPoster(posterUrl, cropCoordinates) {
  if (!posterUrl || !cropCoordinates) return null;

  logger.info("[CROP] Fetching and cropping poster image");
  const buffer = await fetchImageBuffer(posterUrl);
  const metadata = await sharp(buffer).metadata();
  const { width, height } = metadata;

  const INSET_TOP = 3;

  const left = Math.round((cropCoordinates.left / 100) * width);
  const top = Math.round(((cropCoordinates.top + INSET_TOP) / 100) * height);
  const cropWidth = Math.round(((cropCoordinates.right - cropCoordinates.left) / 100) * width);
  const cropHeight = Math.round(((cropCoordinates.bottom - cropCoordinates.top - INSET_TOP) / 100) * height);

  return sharp(buffer)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .toBuffer();
}
