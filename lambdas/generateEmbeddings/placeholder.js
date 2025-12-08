
// for CREATE event:
  // 3. Generate embeddings
  let english_embedding = null;
  let hebrew_embedding = null;

  try {
    english_embedding = await generateEmbedding(english_description);
    hebrew_embedding = await generateEmbedding(hebrew_description);
  } catch (e) {
    console.log("[ERROR] - Embedding error:", e);
  }

  // 4. Insert embeddings
  let embedding_id_en = null;
  let embedding_id_he = null;

  try {
    const { data: enRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'en',
        description: english_description,
        embedding: english_embedding,
      })
      .select()
      .single();

    const { data: heRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'he',
        description: hebrew_description,
        embedding: hebrew_embedding,
      })
      .select()
      .single();

    embedding_id_en = enRow.id;
    embedding_id_he = heRow.id;
  } catch (e) {
    console.log("[ERROR] - Error storing embeddings:", e);
  }

  // for UPDATE event:
    // 2. FETCH CURRENT EVENT (needed for description + embedding IDs)
    const { data: currentEvent, error: eventErr } = await supabase
      .from('events')
      .select('english_description, hebrew_description, embedding_id_en, embedding_id_he')
      .eq('id', id)
      .single();
  
    if (eventErr) {
      console.log("[ERROR] - Error fetching current event:", eventErr);
    }
  
    const englishChanged = body.english_description !== currentEvent.english_description;
    const hebrewChanged  = body.hebrew_description !== currentEvent.hebrew_description;
  
    let newEnglishEmbedding = null;
    let newHebrewEmbedding = null;
  
    // 3. GENERATE NEW EMBEDDINGS IF NEEDED
    if (englishChanged || hebrewChanged) {
    console.log("[DEBUG] - Descriptions changed — generating new embeddings...");
          
      try {
        if (englishChanged) {
          newEnglishEmbedding = await generateEmbedding(body.english_description);
        }
        if (hebrewChanged) {
          newHebrewEmbedding = await generateEmbedding(body.hebrew_description);
        }
      } catch (embeddingErr) {
        console.log("[ERROR] - Error generating embeddings:", embeddingErr);
      }
  
      // Update EN embedding
      if (newEnglishEmbedding) {
        await supabase
          .from('embeddings')
          .update({
            description: body.english_description,
            embedding: newEnglishEmbedding
          })
          .eq('id', currentEvent.embedding_id_en);
      }
  
      // Update HE embedding
      if (newHebrewEmbedding) {
        await supabase
          .from('embeddings')
          .update({
            description: body.hebrew_description,
            embedding: newHebrewEmbedding
          })
          .eq('id', currentEvent.embedding_id_he);
      }
    } else {
      console.log("[DEBUG] - Descriptions unchanged — skipping embedding regeneration.");
    }