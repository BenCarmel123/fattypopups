import { GenerateDraftDetails } from "./api.js";
import { getEntities } from "./draftEntities.js";

const REMINDER = "***"

const generateDraft =
    async (prompt) =>
    {
        const _startTime = Date.now(); // TIME start

        // Get JSON from OpenAI
        const rawOutput = await GenerateDraftDetails(prompt);
        const openaiResponse = JSON.parse(rawOutput);

        // Extract and normalize chef names to array
        const chefNames = Array.isArray(openaiResponse.chef_names) ? openaiResponse.chef_names : [openaiResponse.chef_names];
        const venueName = openaiResponse.venue_name;

        // Fetch venue and chef data from DB
        const { chefEntities, venueEntity } = await getEntities(chefNames, venueName);
        const chefInstagrams = chefEntities.map(chef => chef.instagram_handle || REMINDER).join(',');

        // Build draft response
        const today = new Date().toISOString().split('T')[0];
        const result = {
            title: openaiResponse.event_title,
            start_datetime: today,
            end_datetime: today,
            venue_name: venueName,
            venue_instagram: venueEntity.instagram_handle || REMINDER,
            venue_address: venueEntity.address || REMINDER,
            chef_names: chefNames.join(','),
            chef_instagrams: chefInstagrams,
            reservation_url: REMINDER,
            english_description: openaiResponse.english_description,
            hebrew_description: openaiResponse.hebrew_description,
            is_draft: true
        };

        console.log("[DRAFT]", result);
        console.log("[DRAFT]", Date.now() - _startTime, "ms\n"); // TIME end
        return result;
    }

export { generateDraft };