export const extractS3Key = (url) => url.split(".amazonaws.com/")[1];

export const slugify = (str) => str
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
