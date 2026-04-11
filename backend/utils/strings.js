export const splitList = (str) => str?.split(',').map(s => s.trim()).filter(Boolean) || [];

export const createSlug = (title) => {
  if (!title) return null;

  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const slugify = (str) => str
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');