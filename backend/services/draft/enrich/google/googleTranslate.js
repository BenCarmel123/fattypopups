import { logger } from '../../../../utils/logger.js';
import { TranslateResponseSchema } from '../../../../schemas/google.schema.js';

export async function translate(english_description) {
    logger.info("[TRANSLATE] Calling Google Translate API");
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: english_description,
            target: 'he',
            format: 'text'
        })
    });
    logger.info("[TRANSLATE] Response received from Google Translate");
    const data = await response.json();
    const parsed = TranslateResponseSchema.safeParse(data);
    if (!parsed.success) {
        logger.error("[TRANSLATE] Unexpected response shape:", parsed.error.issues);
        throw new Error("Google Translate returned unexpected response");
    }
    logger.info("[TRANSLATE] Translation complete");
    return parsed.data.data.translations[0].translatedText;
}
