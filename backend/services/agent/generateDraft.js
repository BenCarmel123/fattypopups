import { generateDraftDetails } from "./llm.js";
import { enrichEntities } from "./enrich.js";
import { translate } from "./google/googleTranslate.js";
import { logger } from "../../utils/logger.js";

const REMINDER = "***"

const generateDraft =
    async (prompt, posterUrl = null, contextUrl = null) =>
    {
        const _startTime = Date.now(); // TIME start

        // Get JSON from OpenAI
        logger.info("[DRAFT] Calling generateDraftDetails");
        const rawOutput = await generateDraftDetails(prompt, posterUrl, contextUrl);
        logger.info("[DRAFT] Raw output received, parsing JSON");
        const openaiResponse = JSON.parse(rawOutput);
        logger.info("[DRAFT] JSON parsed successfully");
        const english_description = openaiResponse.english_description

        // Extract and normalize chef names to array
        const chefNames = Array.isArray(openaiResponse.chef_names) ? openaiResponse.chef_names : [openaiResponse.chef_names];
        const venueName = openaiResponse.venue_name;
        logger.info("[DRAFT] Extracted chefs:", chefNames, "venue:", venueName);

        // Extract precise entities and translate English description
        logger.info("[DRAFT] Fetching entities and translating description");
        const [{ chefEntities, venueEntity }, hebrew_description] = await Promise.all([
            enrichEntities(chefNames, venueName),
            translate(english_description)
        ]);
        logger.info("[DRAFT] Entities fetched and translation complete");

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

        logger.info("[DRAFT] Final result:", result);
        logger.info("[DRAFT] Total generation time:", Date.now() - _startTime, "ms");
        return result;
    }

export { generateDraft };