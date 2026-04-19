import { supabase } from "../../config/index.js";

export async function searchSimilarDescriptions(embedding, limit = 5) {
    const { data, error } = await supabase.rpc('match_embeddings', {
        query_embedding: embedding,
        match_count: limit
    });

    if (error) throw new Error(`Error searching embeddings: ${error.message}`);

    return data.map(row => row.description);
}