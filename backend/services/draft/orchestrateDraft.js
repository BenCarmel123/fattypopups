import { generateDraftDetails } from "./generate/callLLM.js";
import { formatDraft } from "./enrich/formatDraft.js";
import { logger } from "../../utils/logger.js";

const orchestrateDraft =
    async (prompt, posterUrl = null, contextUrl = null) =>
    {
        const _startTime = Date.now();

        const openaiResponse = await generateDraftDetails(prompt, posterUrl, contextUrl);

        const enriched = await formatDraft(openaiResponse);
        const today = new Date().toISOString().split('T')[0];

        const result = {
            title: openaiResponse.event_title,
            start_datetime: openaiResponse.start_datetime || today,
            end_datetime: openaiResponse.end_datetime || today,
            venue_name: enriched.venueName,
            venue_instagram: enriched.venueInstagram,
            venue_address: enriched.venueAddress,
            chef_names: enriched.chefNames.join(','),
            chef_instagrams: enriched.chefInstagrams,
            reservation_url: "***",
            english_description: enriched.english_description,
            hebrew_description: enriched.hebrew_description,
            poster: posterUrl,
            is_draft: true
        };

        logger.info("[DRAFT] Final result:", result);
        logger.info("[DRAFT] Total generation time:", Date.now() - _startTime, "ms");
        return result;
    }

export { orchestrateDraft };