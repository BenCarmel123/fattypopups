import { extractStreetAndNumber, extractInstagramHandle } from './parsers.js';
import { getOrCreateInstagram, getInstagramIfExists } from '../../database/instagram/scripts.js';

export async function fetchAddress(venueName) {
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

/**
 * Fetch venue address and chef Instagram. For venue Instagram, only check DB.
 * Returns an object: { venueAddress, streetNumber, chefInstagram, venueInstagram }
 */
export async function fetchVenueDetails(venueName, chefName) {
  const [venueAddress, chefInstagramSearchResult] = await Promise.all([
    fetchAddress(venueName),
    // Only search Instagram for the chef name; caller may pass null/undefined
    chefName ? fetchInstagram(`"${chefName}" site:instagram.com`) : Promise.resolve(null),
  ]);

  // Extract street/number
  const streetNumber = extractStreetAndNumber(venueAddress);
  
  // For chef: full getOrCreate flow, for venue: only check existing DB records
  const [chefInstagramRecord, venueInstagramRecord] = await Promise.all([
    chefName ? getOrCreateInstagram(chefName, "chef") : Promise.resolve(null),
    venueName ? getInstagramIfExists(venueName, "venue") : Promise.resolve(null),
  ]);
  
  const chefInstagram = chefInstagramRecord?.handle || null;
  const venueInstagram = venueInstagramRecord?.handle || null;

  return { venueAddress, streetNumber, chefInstagram, venueInstagram };
}
