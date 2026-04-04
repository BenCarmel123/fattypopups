import { logger } from '../../../../utils/logger.js';

const SERP_API_BASE_URL = 'https://serpapi.com/search.json';

function extractInstagramHandleFromLink(link) {
	if (!link || typeof link !== 'string') return null;

	const match = link.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
	if (!match?.[1]) return null;

	return `@${match[1]}`;
}

function extractInstagramHandleFromSerpResponse(json) {
	const organicResults = Array.isArray(json?.organic_results) ? json.organic_results : [];

	for (const result of organicResults) {
		const handle = extractInstagramHandleFromLink(result?.link);
		if (handle) return handle;
	}

	return null;
}

export async function fetchInstagramHandle(name) {
	if (!name) return null;

	const apiKey = process.env.SERP_API_KEY;
	if (!apiKey) {
		logger.warn('[SERPAPI] SERP_API_KEY not found; skipping Instagram lookup');
		return null;
	}

	const params = new URLSearchParams({
		engine: 'google',
		q: `site:instagram.com \"${name}\"`,
		location: 'Tel Aviv, Israel',
		google_domain: 'google.com',
		hl: 'en',
		gl: 'il',
		num: '5',
		api_key: apiKey
	});

	try {
		const response = await fetch(`${SERP_API_BASE_URL}?${params.toString()}`);
		if (!response.ok) {
			logger.error(`[SERPAPI] Request failed with status ${response.status}`);
			return null;
		}

		const json = await response.json();
		return extractInstagramHandleFromSerpResponse(json);
	} catch (error) {
		logger.error('[SERPAPI] Failed to fetch Instagram handle', error);
		return null;
	}
}


