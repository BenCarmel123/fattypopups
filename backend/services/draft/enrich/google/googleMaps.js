import { MapsResponseSchema } from '../../../../schemas/google.schema.js';
import { logger } from '../../../../utils/logger.js';

function extractStreetAndNumber(addressResponse) {
    const check = MapsResponseSchema.safeParse(addressResponse);
    if (!check.success) {
        logger.error("[MAPS] Unexpected response shape:", check.error.issues);
        return null;
    }
    return check.data.places[0].formattedAddress.split(',')[0].trim();
}

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

export async function fetchVenueAddress(venueName) {
    const venueAddressResponse = await fetchAddress(venueName);
    return extractStreetAndNumber(venueAddressResponse);
}
