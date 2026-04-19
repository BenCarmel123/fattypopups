import { enrichEntities } from "./enrichEntities.js";

const REMINDER = "***"

export async function formatDraft(openaiResponse) {
    const english_description = openaiResponse.english_description;
    const hebrew_description = openaiResponse.hebrew_description;

    const chefNames = Array.isArray(openaiResponse.chef_names) ? openaiResponse.chef_names : [openaiResponse.chef_names];
    const venueName = openaiResponse.venue_name;
    const { chefEntities, venueEntity } = await enrichEntities(chefNames, venueName);

    const chefInstagrams = chefEntities.map(chef => chef.instagram_handle || REMINDER).join(',');

    return {
        chefNames,
        chefInstagrams,
        venueName,
        venueInstagram: venueEntity.instagram_handle || REMINDER,
        venueAddress: venueEntity.address || REMINDER,
        english_description,
        hebrew_description
    };
}
