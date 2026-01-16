import { supabase, s3 } from "../../config/instances.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// 1. Fetch existing image URL from event
const fetchExistingImageUrl = async (id) => {
  try {
    const { data, error } = await supabase
      .from('events')
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
const generateS3KeyAndUrl = (existingUrl, file) => {
  const s3_key = existingUrl
    ? existingUrl.split(".amazonaws.com/")[1]
    : `events/${Date.now()}_${file.originalname}`;
  const s3_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3_key}`;
  
  return { s3_key, s3_url };
};

// 3. Handle case when no file is uploaded
const handleNoFileUpload = async (id, body) => {
  const { data: currentEvent } = await supabase
    .from('events')
    .select('poster, is_draft')
    .eq('id', id)
    .single();
  
  const isDraft = body.is_draft === "true";
  const wasDraft = currentEvent.is_draft;
  const toPublish = wasDraft && !isDraft;

  if (toPublish && !currentEvent.poster) {
    throw new Error("Cannot publish draft: event must have an image.");
  } else {
    // retain existing image
    delete body.poster;
  }
};

// Main function: Handle event image upload/overwrite
export const handleEventImageUpload = async (id, body, file) => {
  if (file) {
    console.log("[FILE] Uploaded file:", file);
    
    // 1. Fetch existing image URL
    const existingUrl = await fetchExistingImageUrl(id);
    
    // 2. Generate S3 key and URL
    const { s3_key, s3_url } = generateS3KeyAndUrl(existingUrl, file);
    body.poster = s3_url;

    // 3. Upload to S3
    await uploadToS3(s3_key, file);
  } else {
    // 4. Handle no file upload case
    await handleNoFileUpload(id, body);
  }
};
