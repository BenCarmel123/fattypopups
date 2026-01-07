import { extractStreetAndNumber, extractInstagramHandle } from './parsers.js';
import { getOrCreateInstagram, getInstagramIfExists } from '../../database/instagram/scripts.js';
import { getOrCreateAddress, getAddressIfExists } from '../../database/address/scripts.js';

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
 * Database-first approach with Google APIs as fallback only
 * Runs operations in parallel for better performance
 */
export async function fetchSpecificDetails(venueName, chefName) {
  console.log('[DRAFT] Starting with:', { venueName, chefName });
  
  // Run all operations in parallel for performance
  const [addressResult, chefInstagramResult, venueInstagramResult] = await Promise.allSettled([
    // 1. Handle venue address: DB first, Google Places API as fallback
    venueName ? (async () => {
      console.log('[ADDRESS] Checking DB for venue:', venueName);
      const existingAddress = await getAddressIfExists(venueName);
      
      if (existingAddress) {
        console.log('[ADDRESS] Found in DB:', existingAddress.venue_address);
        // Use existing address from DB
        const venueAddress = { places: [{ formattedAddress: existingAddress.venue_address }] };
        const streetNumber = existingAddress.venue_address.split(',')[0]?.trim() || existingAddress.venue_address;
        return { venueAddress, streetNumber };
      } else {
        console.log('[ADDRESS] Not in DB, calling Google Places API');
        // Not in DB - call Google Places API and save result
        const venueAddress = await fetchAddress(venueName);
        const streetNumber = extractStreetAndNumber(venueAddress);
        
        // Save to DB for future use
        if (venueAddress && venueAddress.places && venueAddress.places[0]) {
          console.log('[ADDRESS] Saving to DB for future use');
          await getOrCreateAddress(venueName, venueAddress);
        }
        
        return { venueAddress, streetNumber };
      }
    })() : Promise.resolve({ venueAddress: null, streetNumber: null }),

    // 2. Handle chef Instagram: DB first, Google Search as fallback
    chefName ? (async () => {
      console.log('[INSTAGRAM] Checking DB for chef:', chefName);
      const existingChefInstagram = await getInstagramIfExists(chefName, "chef");
      
      if (existingChefInstagram) {
        console.log('[INSTAGRAM] Found chef in DB:', existingChefInstagram.handle);
        // Use existing from DB
        return existingChefInstagram.handle;
      } else {
        console.log('[INSTAGRAM] Chef not in DB, searching Google and saving');
        // Not in DB - search Google and save result
        const newChefRecord = await getOrCreateInstagram(chefName, "chef");
        console.log('[INSTAGRAM] Chef Google search result:', newChefRecord?.handle || 'null');
        return newChefRecord?.handle || null;
      }
    })() : Promise.resolve(null),

    // 3. Handle venue Instagram: DB only, no Google fallback
    venueName ? (async () => {
      console.log('[INSTAGRAM] Checking DB for venue:', venueName);
      const existingVenueInstagram = await getInstagramIfExists(venueName, "venue");
      console.log('[INSTAGRAM] Venue DB result:', existingVenueInstagram?.handle || 'null');
      return existingVenueInstagram?.handle || null;
    })() : Promise.resolve(null)
  ]);

  // Handle results with error checking
  const venueAddress = addressResult.status === 'fulfilled' ? addressResult.value.venueAddress : null;
  const streetNumber = addressResult.status === 'fulfilled' ? addressResult.value.streetNumber : null;
  const chefInstagram = chefInstagramResult.status === 'fulfilled' ? chefInstagramResult.value : null;
  const venueInstagram = venueInstagramResult.status === 'fulfilled' ? venueInstagramResult.value : null;

  // Log any errors
  if (addressResult.status === 'rejected') {
    console.error('[ERROR] Address fetch failed:', addressResult.reason);
  }
  if (chefInstagramResult.status === 'rejected') {
    console.error('[ERROR] Chef Instagram fetch failed:', chefInstagramResult.reason);
  }
  if (venueInstagramResult.status === 'rejected') {
    console.error('[ERROR] Venue Instagram fetch failed:', venueInstagramResult.reason);
  }

  const result = {
    venueAddress,
    streetNumber,
    chefInstagram,
    venueInstagram
  };

  console.log('[fetchSpecificDetails] Final result:', result);
  return result;
}
