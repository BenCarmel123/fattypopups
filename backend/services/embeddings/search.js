import { supabase } from "../../config/index.js";
import { withRetry, RETRY_PROFILES } from "../../utils/retry/index.js";

export async function searchSimilarDescriptions(embedding, limit = 5) {
    const { data, error } = await withRetry(() => supabase.rpc('match_embeddings', {
        query_embedding: embedding,
        match_count: limit
    }), RETRY_PROFILES.SUPABASE_READ);

    if (error) throw new Error(`Error searching embeddings: ${error.message}`);

    return data.map(row => row.description);
}