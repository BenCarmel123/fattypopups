
export function extractChefNameNaive(text) {
  if (typeof text !== "string") return null;

  const match = text.match(/chef_name:\s*(.+)/i);
  if (!match) return null;

  const value = match[1].trim();
  return value.toLowerCase() === "null" || value.toLowerCase() === "none"
    ? null
    : value;
}


export function extractVenueNameNaive(text) {
  if (typeof text !== "string") return null;

  const match = text.match(/venue_name:\s*(.+)/i);
  if (!match) return null;

  const value = match[1].trim();
  return value.toLowerCase() === "null" || value.toLowerCase() === "none"
    ? null
    : value;
}


export function extractChefInstagram(str) {
  if (typeof str !== "string") return null;

  const match = str.match(/chef:\s*([a-zA-Z0-9._]+)/i);
  if (!match) return null;

  const handle = match[1];
  return handle.toLowerCase() === "none" ? null : handle;
}

export function extractVenueInstagram(str) {
  if (typeof str !== "string") return null;

  const match = str.match(/venue:\s*([a-zA-Z0-9._]+)/i);
  if (!match) return null;

  const handle = match[1];
  return handle.toLowerCase() === "none" ? null : handle;
}

export async function extractVenueAddress(venueName) {
  if (!venueName) return null;

  const query = encodeURIComponent(`${venueName} Tel Aviv`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  return data.results[0].formatted_address;
}
