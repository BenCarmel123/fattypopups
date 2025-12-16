import { supabase } from "../../config/supabaseClient.js";
import { s3 } from '../../config/s3Client.js';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateEmbedding } from "../../openai/agent.js";

// UPDATE event (PUT) with image overwrite + embedding update
export const updateEvent = async (id, body, file) => {
  console.log("[DEBUG] Received PUT /api/events/:id");
  console.log("[DEBUG] Request body:", body);

  // 1. IMAGE OVERWRITE 
  if (file) {
    console.log("[DEBUG] Uploaded file:", file);
    let s3_key;
    let s3_url;

    // Fetch existing image URL
    try {
        const { data, error } = await supabase
            .from('events')
            .select('poster')
            .eq('id', id)
            .single();
        if (error) throw error;

        // Use existing key or create new one if undefined
        s3_key = data?.poster
            ? data.poster.split(".amazonaws.com/")[1]
            : `events/${Date.now()}_${file.originalname}`;
        s3_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3_key}`;
        body.poster = s3_url;
    } catch (err) {
        console.log("[ERROR] - Error fetching existing image URL:", err);
        // fallback key if fetch fails
        s3_key = `events/${Date.now()}_${file.originalname}`;
        s3_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3_key}`;
        body.poster = s3_url;
    }

    // Upload to S3
    try {
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3_key,
                Body: file.buffer,
                ContentType: file.mimetype
            })
        );
    } catch (err) {
        console.log("[ERROR] - Error uploading file:", err);
    }
} else {
    const { data: currentEvent } = await supabase
      .from('events')
      .select('poster')
      .eq('id', id)
      .single();
    
    const isDraft = body.is_draft === "true";
    const wasDraft = currentEvent.is_draft;
    const toPublish = wasDraft && !isDraft;

    if (toPublish && !currentEvent.poster) {
      throw new Error("Cannot publish draft: event must have an image.");
    } else {
      // retain existing image
      delete body.poster;
    }
}

// 2. FETCH CURRENT EVENT (needed for description + embedding IDs)
const { data: currentEvent, error: eventErr } = await supabase
  .from('events')
  .select('english_description, hebrew_description, embedding_id_en, embedding_id_he, is_draft')
  .eq('id', id)
  .single();

if (eventErr) {
  console.log("[ERROR] - Error fetching current event:", eventErr);
}

// Update Chef Names & Instagrams
const chefNamesArray = body.chef_names
  ? body.chef_names.split(',').map(name => name.trim())
  : [];

const chefInstagramsArray = body.chef_instagrams
  ? body.chef_instagrams.split(',').map(handle => handle.trim())
  : [];

body.chef_names = chefNamesArray;
body.chef_instagrams = chefInstagramsArray;

// MINIMAL CHANGE: Draft / Publish flags
const isDraft = body.is_draft === "true"; 
const wasDraft = currentEvent.is_draft; 
const toPublish = wasDraft && !isDraft;
const stillDraft = wasDraft && isDraft;
const alreadyPublished = !wasDraft;

// Compute embedding changes
const englishChanged = body.english_description !== currentEvent.english_description;
const hebrewChanged  = body.hebrew_description !== currentEvent.hebrew_description;

let newEnglishEmbedding = null;
let newHebrewEmbedding = null;
let en_id = null;
let he_id = null;

// 3. GENERATE NEW EMBEDDINGS (IF NEEDED)
if (toPublish || (alreadyPublished && (englishChanged || hebrewChanged))) {
  console.log("[DEBUG] - Descriptions changed — generating new embeddings...");    
  try {
    if (toPublish || englishChanged) {
      newEnglishEmbedding = await generateEmbedding(body.english_description);
    }
    if (toPublish || hebrewChanged) {
      newHebrewEmbedding = await generateEmbedding(body.hebrew_description);
    }
  } catch (embeddingErr) {
    console.log("[ERROR] - Error generating embeddings:", embeddingErr);
  }
}

// 4. UPDATE EMBEDDINGS TABLE
if (toPublish) { 
  try {
    const { data: enRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'en',
        description: body.english_description,
        embedding: newEnglishEmbedding,
      })
      .select()
      .single();

    const { data: heRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'he',
        description: body.hebrew_description,
        embedding: newHebrewEmbedding,
      })
      .select()
      .single();

      en_id = enRow.id
      he_id = heRow.id

  } 
  catch (e) {
    console.log("[ERROR] - Error inserting embeddings:", e);
  }
}

// Update embeddings for already published events if changed
if (alreadyPublished) {
  try {
    if (newEnglishEmbedding) {
      await supabase
        .from('embeddings')
        .update({
          description: body.english_description,
          embedding: newEnglishEmbedding
        })
        .eq('id', currentEvent.embedding_id_en);
    }
    if (newHebrewEmbedding) {
      await supabase
        .from('embeddings')
        .update({
          description: body.hebrew_description,
          embedding: newHebrewEmbedding
        })
        .eq('id', currentEvent.embedding_id_he);
    }
  } catch(e) {
    console.log("[ERROR] - Error updating embeddings:", e);
  }
} 

// 5. UPDATE EVENT
if (toPublish) {
  body.embedding_id_en = en_id;
  body.embedding_id_he = he_id;
}

try {
  const { data: updatedEvent, error: updateErr } = await supabase
    .from('events')
    .update(body)
    .eq('id', id)
    .select()
    .single();
  if (updateErr) throw updateErr;
  return updatedEvent;
} 
catch (err) {
  console.log("[ERROR] - Error updating event:", err);
  throw err;
}
};
