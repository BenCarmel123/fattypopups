import {
  fetchExistingImageUrl,
  uploadToS3,
  deleteFromS3,
  generateS3KeyAndUrl,
  handleNoFileUpload
} from "./helpers.js";

// Main function: Handle event image upload/overwrite
export const handleEventImageUpload = async (id, body, file, currentEvent) => {
  if (file) {
    console.log("[FILE] Uploaded file:", file);
    
    // 1. Get existing URL for potential cleanup
    const existingUrl = currentEvent?.poster || await fetchExistingImageUrl(id);
    
    // 2. Generate NEW S3 key and URL (always unique)
    const { s3_key, s3_url } = generateS3KeyAndUrl(file);
    body.poster = s3_url;

    // 3. Upload new file to S3
    await uploadToS3(s3_key, file);
    
    // 4. Delete old file from S3 if it exists
    if (existingUrl) {
      const oldKey = existingUrl.split(".amazonaws.com/")[1];
      await deleteFromS3(oldKey);
    }
  } else {
    // 5. Handle no file upload case
    await handleNoFileUpload(body, currentEvent);
  }
};
