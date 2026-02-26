import { supabase, s3 } from "../../config/index.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateS3KeyAndUrl } from './utils.js';
import { isTrue } from '../../utils/isTrue.js';
import { logger } from "../../utils/logger.js";

export const uploadToS3 = async (s3_key, file) => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3_key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );
  } catch (err) {
    logger.error("Error uploading file:", err);
    throw err;
  }
};

const fetchExistingImageUrl = async (id) => {
  try {
    const { data, error } = await supabase
      .from('events_new')
      .select('poster')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data?.poster || null;
  } catch (err) {
    logger.error("Error fetching existing image URL:", err);
    return null;
  }
};

const handleNoFileUpload = async (body, currentEvent) => {
  if (!currentEvent) {
    delete body.poster;
    return;
  }
  const isDraft = isTrue(body.is_draft);
  const wasDraft = isTrue(currentEvent.is_draft);
  const toPublish = wasDraft && !isDraft;

  if (toPublish && !currentEvent.poster) {
    throw new Error("Cannot publish draft: event must have an image.");
  } else {
    delete body.poster;
  }
};

// Main function: Handle event image upload/overwrite
export const handleEventImageUpload = async (id, body, file, currentEvent) => {
  if (file) {
    logger.info("[FILE] Uploaded file:", file);

    // 1. Use poster from currentEvent if available, otherwise fetch
    const existingUrl = currentEvent?.poster || await fetchExistingImageUrl(id);

    // 2. Generate S3 key and URL
    const { s3_key, s3_url } = generateS3KeyAndUrl(existingUrl, file, body.title);

    // 3. Upload to S3
    await uploadToS3(s3_key, file);

    return s3_url;
  } else {
    // 4. Handle no file upload case
    await handleNoFileUpload(body, currentEvent);
    return null;
  }
};
