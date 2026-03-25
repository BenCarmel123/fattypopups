import sharp from 'sharp';
import { logger } from '../../../utils/logger.js';

const fetchImageBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};

export async function cropPoster(posterUrl, cropCoordinates) {
  if (!posterUrl || !cropCoordinates) return null;

  logger.info("[CROP] Fetching and cropping poster image");
  const buffer = await fetchImageBuffer(posterUrl);
  const metadata = await sharp(buffer).metadata();
  const { width, height } = metadata;

  const INSET = 4;
  const insetLeft = Math.min(cropCoordinates.left + INSET, cropCoordinates.right);
  const insetTop = Math.min(cropCoordinates.top + INSET, cropCoordinates.bottom);
  const insetRight = Math.max(cropCoordinates.right - INSET, insetLeft);
  const insetBottom = Math.max(cropCoordinates.bottom - (INSET * 2), insetTop);

  const left = Math.round((insetLeft / 100) * width);
  const top = Math.round((insetTop / 100) * height);
  const cropWidth = Math.round(((insetRight - insetLeft) / 100) * width);
  const cropHeight = Math.round(((insetBottom - insetTop) / 100) * height);

  return sharp(buffer)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .toBuffer();
}
