import { deleteEventsByTitles, getImageUrlsByTitles } from '../../entities/event/operations.js';
import { deleteS3Images } from 'services/s3/delete.js';

export const deleteEvents = async (titles) => {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error('Titles must be a non-empty array');
  }

  const imageUrls = await getImageUrlsByTitles(titles);
  await deleteS3Images(imageUrls);
  const result = await deleteEventsByTitles(titles);

  return result;
};
