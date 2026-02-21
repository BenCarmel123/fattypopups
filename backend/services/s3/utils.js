export const extractS3Key = (url) => url.split(".amazonaws.com/")[1];

export const slugify = (str) => str
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const parseFilename = (originalname, title) => {
  const ext = originalname.match(/\.[^.]+$/)?.[0] || '';
  const slug = title ? slugify(title) : originalname.replace(/\.[^.]+$/, '');
  return { slug, ext };
};

export const buildS3Url = (s3_key) =>
  `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3_key}`;

export const generateS3KeyAndUrl = (existingUrl, file, title) => {
  const { slug, ext } = parseFilename(file.originalname, title);
  const folder = process.env.NODE_ENV === 'development' ? 'dev' : 'posters';
  const s3_key = existingUrl ? extractS3Key(existingUrl) : `${folder}/${slug}${ext}`;
  const s3_url = buildS3Url(s3_key);
  return { s3_key, s3_url };
};
