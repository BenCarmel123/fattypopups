import { s3 } from "../../config/index.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { extractS3Key } from "./utils.js";

export const deleteS3Images = async (urls) => {
  const validUrls = urls.filter(Boolean); // remove null/undefined (events without images)

  await Promise.all(
    validUrls.map(async (url) => {
      const key = extractS3Key(url);
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        }));
        console.log(`[S3] Deleted image: ${key}`);
      } catch (err) {
        console.error(`[S3] Failed to delete image: ${key}`, err);
      }
    })
  );
};
