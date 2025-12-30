
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

export function extractDescriptionNaive(locale, text) {
  if (typeof text !== "string") return null;

  const key =
    locale === "he" ? "hebrew_description" : "english_description";

  const match = text.match(
    new RegExp(`${key}\\s*:\\s*([^\\n\\r]+)`, "i")
  );


  if (!match) return null;

  const value = match[1].trim();
  console.log("[DRAFT] - returning " + value)
  return value.toLowerCase() === "null" || value.toLowerCase() === "none"
    ? null
    : value;
}

export async function extractVenueAddress(venueName) {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.formattedAddress'
        },
        body: JSON.stringify({
            textQuery: `${venueName} Tel Aviv`,
            languageCode: 'en',
            maxResultCount: 1
        })
    });

    return response.json();
}

export function extractStreetAndNumber(addressResponse) {
    const fullAddress = addressResponse?.places?.[0]?.formattedAddress;
    if (!fullAddress) return null;
    return fullAddress.split(',')[0].trim();
}


export async function fetchInstagram(query) {
  const API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
  const CX = process.env.GOOGLE_CX;

  if (!API_KEY || !CX) return null;

  const url =
    `https://www.googleapis.com/customsearch/v1` +
    `?key=${API_KEY}` +
    `&cx=${CX}` +
    `&q=${encodeURIComponent(query)}` +
    `&num=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function extractInstagramHandle(googleResponse) {
  if (!googleResponse || !googleResponse.items || googleResponse.items.length === 0) {
    return null;
  }

  const link = googleResponse.items[0].link;
  const match = link.match(/instagram\.com\/([^/?]+)/);
  const handle = match? "@" + match[1] : null;
  return handle;
}
