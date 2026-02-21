import { GenerateDraftDetails } from "./llm.js";
import { getEntities } from "./entities.js";
import { translate } from "./utils/googleTranslate.js";

const REMINDER = "***"

const generateDraft =
    async (prompt, posterUrl = null, contextUrl = null) =>
    {
        const _startTime = Date.now(); // TIME start

        // Get JSON from OpenAI
        const rawOutput = await GenerateDraftDetails(prompt, posterUrl, contextUrl);
        const openaiResponse = JSON.parse(rawOutput);
        const english_description = openaiResponse.english_description

        // Extract and normalize chef names to array
        const chefNames = Array.isArray(openaiResponse.chef_names) ? openaiResponse.chef_names : [openaiResponse.chef_names];
        const venueName = openaiResponse.venue_name;

        // Extract precise entities and translate English description 
        const [{ chefEntities, venueEntity }, hebrew_description] = await Promise.all([
            getEntities(chefNames, venueName),
            translate(english_description)
        ]);
        
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
            english_description: english_description,
            hebrew_description: hebrew_description,
            poster: posterUrl,
            is_draft: true
        };

        console.log("[DRAFT]", result);
        console.log("[DRAFT]", Date.now() - _startTime, "ms\n"); // TIME end
        return result;
    }

export { generateDraft };