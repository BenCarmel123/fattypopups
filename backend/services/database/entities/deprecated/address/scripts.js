import { supabase } from '../../../../config/index.js';

/**
 * Check if an address exists in the database (DB only, no API calls)
 * @param {string} venueName - The venue name to search for
 * @returns {Object|null} - Address record if found, null if not found
 */
export async function getAddressIfExists(venueName) {
  console.log('[ADDRESS] Checking DB for existing address:', venueName);
  
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('venue_name', venueName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - this is expected, not an error
        console.log('[ADDRESS] No existing address found in DB for:', venueName);
        return null;
      }
      throw error;
    }

    console.log('[ADDRESS] Found existing address in DB:', data);
    return data;
  } catch (error) {
    console.error('[ERROR] Failed to check existing address:', error);
    return null;
  }
}

/**
 * Get address from DB or create new one using Google Places API
 * @param {string} venueName - The venue name
 * @param {Object} googlePlacesResult - The result from Google Places API (optional if checking DB first)
 * @returns {Object|null} - Address record from DB
 */
export async function getOrCreateAddress(venueName, googlePlacesResult) {
  console.log('[ADDRESS] Getting or creating address for:', venueName);
  
  // First check if it exists in DB
  const existingAddress = await getAddressIfExists(venueName);
  if (existingAddress) {
    console.log('[ADDRESS] Address already exists in DB, returning existing');
    return existingAddress;
  }

  // If not in DB and we have Google Places result, save it
  if (googlePlacesResult && googlePlacesResult.places && googlePlacesResult.places[0]) {
    const formattedAddress = googlePlacesResult.places[0].formattedAddress;
    
    console.log('[ADDRESS] Saving new address to DB:', { venueName, formattedAddress });
    
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([
          {
            venue_name: venueName,
            venue_address: formattedAddress
          }
        ])
        .select()
        .single();

      if (error) {
        // Check if it's a unique constraint violation (race condition)
        if (error.code === '23505') {
          console.log('[ADDRESS] Race condition detected, fetching existing record');
          return await getAddressIfExists(venueName);
        }
        throw error;
      }

      console.log('[ADDRESS] Successfully saved new address to DB:', data);
      return data;
    } catch (error) {
      console.error('[ERROR] Failed to save address to DB:', error);
      return null;
    }
  }

  console.log('[ADDRESS] No Google Places result provided, cannot create address');
  return null;
}