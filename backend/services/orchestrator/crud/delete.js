import { deleteEventById, getImageUrlById } from '../../entities/event/operations.js';
import { deleteS3Images } from '#services/s3/delete.js';
import { invalidateEventsCache } from '../../cache/invalidation.js';

export const deleteEvent = async (id) => {
  const imageUrl = await getImageUrlById(id);
  if (imageUrl) await deleteS3Images([imageUrl]);
  const result = await deleteEventById(id);

  await invalidateEventsCache();
  return result;
};
