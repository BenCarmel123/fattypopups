
export function extractChefNameNaive(text) {
  const key = `"chef_name":`;
  const idx = text.indexOf(key);
  if (idx === -1) return null;

  const afterKey = text.slice(idx + key.length).trim();

  if (!afterKey.startsWith(`"`)) return null;

  const endQuoteIdx = afterKey.indexOf(`"`, 1);
  if (endQuoteIdx === -1) return null;

  return afterKey.slice(1, endQuoteIdx);
}

export function extractVenueNameNaive(text) {
    const key = `"venue_name":`;
    const idx = text.indexOf(key);
    if (idx === -1) return null;

    const afterKey = text.slice(idx + key.length).trim();

    if (!afterKey.startsWith(`"`)) return null;

    const endQuoteIdx = afterKey.indexOf(`"`, 1);
    if (endQuoteIdx === -1) return null;

    return afterKey.slice(1, endQuoteIdx);
}

