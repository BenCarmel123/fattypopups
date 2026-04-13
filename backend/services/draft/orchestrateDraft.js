const ONTOPO_URL = "https://ontopo.com/he/il";
const today = new Date().toISOString().split('T')[0];

const resolveReservationUrl = (instagramHandle) => {
    if (instagramHandle && instagramHandle !== "***")
        return `https://instagram.com/${instagramHandle.replace(/^@/, '')}`;
    return ONTOPO_URL;
};

import { analyzeImage } from "./generate/vision/visionCall.js";
import { fetchStyleExamples } from "./generate/text/similaritySearch.js";
import { generateDraftDetails } from "./generate/text/textCall.js";
import { cropPoster } from "./image/crop.js";
import { uploadCroppedPoster } from "./image/upload.js";
import { formatDraft } from "./enrich/formatDraft.js";
import { logger } from "../../utils/logger.js";
import { resolveEndDatetime } from "../../utils/time.js";

const imagePipeline = async (posterUrl, cropCoordinates) => {
    logger.info("[IMAGE PIPELINE] Starting crop + upload");
    const croppedBuffer = await cropPoster(posterUrl, cropCoordinates);
    const url = await uploadCroppedPoster(croppedBuffer);
    logger.info("[IMAGE PIPELINE] Complete");
    return url;
};

const textPipeline = async (prompt, styleExamples) => {
    logger.info("[TEXT PIPELINE] Starting LLM + enrich");
    const llmResponse = await generateDraftDetails(prompt, styleExamples);
    const enriched = await formatDraft(llmResponse);
    logger.info("[TEXT PIPELINE] Complete");
    return { llmResponse, enriched };
};

const orchestrateDraft =
    async (prompt, posterUrl = null, contextUrl = null) =>
    {
        const _startTime = Date.now();

        // Stage 1 — Parallel: vision analysis + similarity search
        const [{ extractedText, cropCoordinates }, styleExamples] = await Promise.all([
            analyzeImage(posterUrl, contextUrl),
            fetchStyleExamples(prompt)
        ]);

        const enrichedPrompt = extractedText
            ? `${prompt}\n\nExtracted from poster:\n${extractedText}`
            : prompt;

        // Stage 2 — Parallel: image pipeline (crop → upload) + text pipeline (LLM → enrich)
        const [croppedPosterUrl, { llmResponse, enriched }] = await Promise.all([
            imagePipeline(posterUrl, cropCoordinates),
            textPipeline(enrichedPrompt, styleExamples)
        ]);

        const result = {
            title: llmResponse.event_title,
            start_datetime: llmResponse.start_datetime || today,
            end_datetime: resolveEndDatetime(llmResponse.start_datetime || today, llmResponse.end_datetime),
            venue_name: enriched.venueName,
            venue_instagram: enriched.venueInstagram,
            venue_address: enriched.venueAddress,
            chef_names: enriched.chefNames.join(','),
            chef_instagrams: enriched.chefInstagrams,
            reservation_url: resolveReservationUrl(enriched.venueInstagram),
            english_description: enriched.english_description,
            hebrew_description: enriched.hebrew_description,
            poster: croppedPosterUrl || posterUrl,
            is_draft: true
        };

        logger.info("[DRAFT] Final result:", result);
        logger.info("[DRAFT] Total generation time:", Date.now() - _startTime, "ms");
        return result;
    }

export { orchestrateDraft };