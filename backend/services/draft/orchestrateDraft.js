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
import { fetchImageBuffer } from "../../utils/fetchImageBuffer.js";
import { uploadToS3 } from "../s3/upload.js";
import { buildS3Url } from "../s3/utils.js";
import { formatDraft } from "./enrich/formatDraft.js";
import { logger } from "../../utils/logger.js";
import { resolveEndDatetime } from "../../utils/time.js";

const imagePipeline = async (posterUrl, cropCoordinates, toCrop) => {
    logger.info("[IMAGE PIPELINE] Starting image + upload");
    const buffer = toCrop
        ? await cropPoster(posterUrl, cropCoordinates)
        : await fetchImageBuffer(posterUrl);
    const s3_key = `posters/poster-${Date.now()}.jpg`;
    await uploadToS3(s3_key, { buffer, mimetype: 'image/jpeg' });
    const url = buildS3Url(s3_key);
    logger.info("[IMAGE PIPELINE] Complete:", url);
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
    async (prompt, posterUrl = null, contextUrl = null, toCrop = true) =>
    {
        const _startTime = Date.now();

        // Stage 1 — Parallel: vision analysis + similarity search
        const [{ extractedText, cropCoordinates }, styleExamples] = await Promise.all([
            analyzeImage(posterUrl, contextUrl, toCrop),
            fetchStyleExamples(prompt)
        ]);

        const enrichedPrompt = extractedText
            ? `${prompt}\n\nExtracted from poster:\n${extractedText}`
            : prompt;

        // Stage 2 — Parallel: image pipeline (crop → upload) + text pipeline (LLM → enrich)
        const [croppedPosterUrl, { llmResponse, enriched }] = await Promise.all([
            imagePipeline(posterUrl, cropCoordinates, toCrop),
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