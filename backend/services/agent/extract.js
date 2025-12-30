
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

async function fetchVenueAddress(venueName) {
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
