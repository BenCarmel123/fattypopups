import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateEmbedding = async (text) => {
    const res = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return res.data[0].embedding;
};

const insertEmbedding = async (language, description, embedding, chefNames) => {
    const { data, error } = await supabase
        .from('embeddings')
        .insert({ language, description, embedding, chef_names: chefNames })
        .select()
        .single();
    if (error) throw new Error(`Error inserting embedding (${language}): ${error.message}`);
    return data;
};

const fixMissingEmbeddings = async () => {
    const { data: events, error } = await supabase
        .from('events_new')
        .select('id, english_description, hebrew_description, embedding_id_en, embedding_id_he')
        .eq('is_draft', false)
        .or('embedding_id_en.is.null,embedding_id_he.is.null');

    if (error) {
        console.error('[VERIFY] Error fetching events:', error.message);
        return;
    }

    if (!events?.length) {
        console.log('[VERIFY] All published events have embeddings');
        return;
    }

    console.log(`[VERIFY] Found ${events.length} event(s) with missing embeddings`);

    for (const event of events) {
        try {
            const updates = {};

            const [enEmbedding, heEmbedding] = await Promise.all([
                event.embedding_id_en ? null : generateEmbedding(event.english_description),
                event.embedding_id_he ? null : generateEmbedding(event.hebrew_description),
            ]);

            if (enEmbedding) {
                const row = await insertEmbedding('en', event.english_description, enEmbedding, null);
                updates.embedding_id_en = row.id;
            }

            if (heEmbedding) {
                const row = await insertEmbedding('he', event.hebrew_description, heEmbedding, null);
                updates.embedding_id_he = row.id;
            }

            if (Object.keys(updates).length > 0) {
                const { error: updateError } = await supabase
                    .from('events_new')
                    .update(updates)
                    .eq('id', event.id);

                if (updateError) throw new Error(updateError.message);
                console.log(`[VERIFY] Fixed embeddings for event ID: ${event.id}`);
            }
        } catch (err) {
            console.error(`[VERIFY] Failed to fix event ID ${event.id}:`, err.message);
        }
    }
};

export const handler = async () => {
    await fixMissingEmbeddings();
    return { statusCode: 200, body: JSON.stringify({ message: 'Embedding verification complete' }) };
};
