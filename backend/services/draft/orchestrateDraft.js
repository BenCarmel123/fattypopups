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
import { resolveEndDatetime } from "../../utils/time.js";

const imagePipeline = async (posterUrl, cropCoordinates) => {
    const croppedBuffer = await cropPoster(posterUrl, cropCoordinates);
    const url = await uploadCroppedPoster(croppedBuffer);
    return url;
};

const textPipeline = async (prompt, styleExamples) => {
    const llmResponse = await generateDraftDetails(prompt, styleExamples);
    const enriched = await formatDraft(llmResponse);
    return { llmResponse, enriched };
};

const orchestrateDraft =
    async (prompt, posterUrl = null, contextUrl = null) =>
    {
        // Stage 1 — Vision analysis
        let extractedText, cropCoordinates;
        try {
            ({ extractedText, cropCoordinates } = await analyzeImage(posterUrl, contextUrl));
        } catch (err) {
            throw new Error(`[STAGE 1] ${err.message}`);
        }

        const enrichedPrompt = extractedText
            ? `${prompt}\n\nExtracted from poster:\n${extractedText}`
            : prompt;

        // Stage 2 — Parallel: image pipeline (crop → upload) + text pipeline (similarity search → LLM → enrich)
        let croppedPosterUrl, llmResponse, enriched;
        try {
            const styleExamples = await fetchStyleExamples(enrichedPrompt);
            [croppedPosterUrl, { llmResponse, enriched }] = await Promise.all([
                imagePipeline(posterUrl, cropCoordinates),
                textPipeline(enrichedPrompt, styleExamples)
            ]);
        } catch (err) {
            throw new Error(`[STAGE 2] ${err.message}`);
        }

        const result = {
            title: enriched.title,
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

        return result;
    }

export { orchestrateDraft };