import { supabase, s3 } from "../../config/index.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { parseFilename, extractS3Key, buildS3Url } from './utils.js';
import { isTrue } from '../utils.js';

// 1. Fetch existing image URL from event
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
    console.log("[ERROR] Error fetching existing image URL:", err);
    return null;
  }
};

// 2. Upload file to S3
const uploadToS3 = async (s3_key, file) => {
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
    console.log("[ERROR] Error uploading file:", err);
    throw err;
  }
};

// Generate S3 key and URL for event image
const generateS3KeyAndUrl = (existingUrl, file, title) => {
  const { slug, ext } = parseFilename(file.originalname, title);
  const folder = process.env.NODE_ENV === 'development' ? 'dev' : 'posters';
  const s3_key = existingUrl ? extractS3Key(existingUrl) : `${folder}/${slug}${ext}`;
  const s3_url = buildS3Url(s3_key);

  return { s3_key, s3_url };
};

// 3. Handle case when no file is uploaded
const handleNoFileUpload = async (body, currentEvent) => {
  const isDraft = isTrue(body.is_draft);
  const wasDraft = isTrue(currentEvent.is_draft);
  const toPublish = wasDraft && !isDraft;

  if (toPublish && !currentEvent.poster) {
    throw new Error("Cannot publish draft: event must have an image.");
  } else {
    // retain existing image
    delete body.poster;
  }
};

// Main function: Handle event image upload/overwrite
export const handleEventImageUpload = async (id, body, file, currentEvent) => {
  if (file) {
    console.log("[FILE] Uploaded file:", file);
    
    // 1. Use poster from currentEvent if available, otherwise fetch
    const existingUrl = currentEvent?.poster || await fetchExistingImageUrl(id);
    
    // 2. Generate S3 key and URL
    const { s3_key, s3_url } = generateS3KeyAndUrl(existingUrl, file, body.title);
    body.poster = s3_url;

    // 3. Upload to S3
    await uploadToS3(s3_key, file);
  } else {
    // 4. Handle no file upload case
    await handleNoFileUpload(body, currentEvent);
  }
};
