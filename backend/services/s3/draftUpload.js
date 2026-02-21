import { parseFilename, buildS3Url, generateS3KeyAndUrl } from './utils.js';
import { uploadToS3 } from './upload.js';

const uploadPosterFile = async (file) => {
  if (!file) return null;
  const { s3_key, s3_url } = generateS3KeyAndUrl(null, file, null);
  await uploadToS3(s3_key, file);
  return s3_url;
};

const uploadContextFile = async (file) => {
  if (!file) return null;
  const { ext } = parseFilename(file.originalname, null);
  const s3_key = `tmp/context-${Date.now()}${ext}`;
  await uploadToS3(s3_key, file);
  return buildS3Url(s3_key);
};

export const uploadDraftImages = async (posterFile, contextFile) => {
  const [posterUrl, contextUrl] = await Promise.all([
    uploadPosterFile(posterFile),
    uploadContextFile(contextFile),
  ]);
  return { posterUrl, contextUrl };
};
