export const createSlug = (title) => {
  if (!title) return null;

  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const generateS3KeyAndUrl = (existingUrl, file, id, body) => {
  const s3_key = existingUrl
    ? existingUrl.split(".amazonaws.com/")[1]
    : (() => {
        const slug = createSlug(body.title);
        const fileName = slug
          ? `${slug}-event-${id}.jpg`
          : `event-${id}-${Date.now()}.jpg`;
        return `events/${fileName}`;
      })();
  const s3_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3_key}`;

  return { s3_key, s3_url };
};
