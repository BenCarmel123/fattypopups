import { supabase, s3 } from "../../config/index.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Fetch existing image URL from event
export const fetchExistingImageUrl = async (id) => {
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

// Upload file to S3
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
    console.log("[ERROR] Error uploading file:", err);
    throw err;
  }
};

// Delete old file from S3
export const deleteFromS3 = async (s3_key) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3_key
      })
    );
    console.log("[S3] Deleted old file:", s3_key);
  } catch (err) {
    console.log("[ERROR] Error deleting old file:", err);
    // Don't throw - we don't want to fail the update if deletion fails
  }
};

// Generate S3 key and URL for event image (always creates new file)
export const generateS3KeyAndUrl = (file) => {
  const s3_key = `events/${Date.now()}_${file.originalname}`;
  const s3_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3_key}`;
  
  return { s3_key, s3_url };
};

// Handle case when no file is uploaded
export const handleNoFileUpload = async (body, currentEvent) => {
  const isDraft = body.is_draft === "true" || body.is_draft === true;
  const wasDraft = currentEvent.is_draft === true || currentEvent.is_draft === "true";
  const toPublish = wasDraft && !isDraft;

  if (toPublish && !currentEvent.poster) {
    throw new Error("Cannot publish draft: event must have an image.");
  } else {
    // retain existing image
    delete body.poster;
  }
};
