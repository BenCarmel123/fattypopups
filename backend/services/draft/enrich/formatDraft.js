import { enrichEntities } from "./enrichEntities.js";
import { translate } from "./google/googleTranslate.js";
import { logger } from "../../../utils/logger.js";

const REMINDER = "***"

export async function formatDraft(openaiResponse) {
    const english_description = openaiResponse.english_description;

    const chefNames = Array.isArray(openaiResponse.chef_names) ? openaiResponse.chef_names : [openaiResponse.chef_names];
    const venueName = openaiResponse.venue_name;
    const [{ chefEntities, venueEntity }, hebrew_description] = await Promise.all([
        enrichEntities(chefNames, venueName),
        translate(english_description)
    ]);
    logger.info("[ENRICH] Entities fetched and translation complete");

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
