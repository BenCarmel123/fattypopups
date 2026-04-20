import { enrichEntities } from "./enrichEntities.js";

const REMINDER = "***"

function replaceName(text, oldName, newName) {
    if (!text || !oldName || !newName || oldName === newName) return text;
    const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(escaped, 'gi'), newName);
}

export async function formatDraft(openaiResponse) {
    let english_description = openaiResponse.english_description;
    let hebrew_description = openaiResponse.hebrew_description;
    let title = openaiResponse.event_title;

    const chefNames = Array.isArray(openaiResponse.chef_names) ? openaiResponse.chef_names : [openaiResponse.chef_names];
    const venueName = openaiResponse.venue_name;
    const { chefEntities, venueEntity } = await enrichEntities(chefNames, venueName);

    const chefInstagrams = chefEntities.map(chef => chef.instagram_handle || REMINDER).join(',');
    const resolvedChefNames = chefEntities.map((chef, i) => chef.name || chefNames[i]);

    const nameReplacements = [
        ...chefNames.map((original, i) => [original, resolvedChefNames[i]]),
        [venueName, venueEntity.name || venueName]
    ];

    for (const [oldName, newName] of nameReplacements) {
        english_description = replaceName(english_description, oldName, newName);
        hebrew_description = replaceName(hebrew_description, oldName, newName);
        title = replaceName(title, oldName, newName);
    }

    return {
        title,
        chefNames: resolvedChefNames,
        chefInstagrams,
        venueName: venueEntity.name || venueName,
        venueInstagram: venueEntity.instagram_handle || REMINDER,
        venueAddress: venueEntity.address || REMINDER,
        english_description,
        hebrew_description
    };
}
