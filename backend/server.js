// Config and imports
const express = require('express');
const cors = require('cors');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { generateEmbedding }  = require('./agent.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_LOCAL_URL,
    process.env.FRONTEND_PROD_URL,
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(` Incoming ${req.method} ${req.url}`);
  next();
});

// DB 
const supabase = createClient(process.env.DATABASE_PROD_URL, process.env.SUPABASE_KEY);

// AWS S3 setup
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Multer S3 storage (for POST)
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, 
    key: function (req, file, cb) {
      cb(null, `posters/${Date.now()}-${file.originalname}`); // file path in S3
    }
  })
});

// Multer memory storage (for PUT)
const uploadMemory = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send(' FattyPopups backend is running!');
});

// Routes
app.get('/' + process.env.ADMIN_ROUTE, async (req, res) => {
    try {
            res.json({ message: 'Admin route reached!' });
            const events = await supabase
            .from('events')
            .select('*')
            .order('start_datetime', { ascending: true });
            res.json(events.data);
        }
catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Add new event (POST)
// Add new event
app.post('/api/events', upload.single("poster"), async (req, res) => {
  console.log("Received POST /api/events");
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const {
    title,
    start_datetime,
    end_datetime,
    venue_instagram,
    venue_address,
    chef_names,
    chef_instagrams,
    reservation_url,
    english_description,
    hebrew_description
  } = req.body;

  const chefNamesArray = chef_names
    ? chef_names.split(',').map(name => name.trim())
    : [];
  const chefInstagramsArray = chef_instagrams
    ? chef_instagrams.split(',').map(handle => handle.trim())
    : [];

  const image_url = req.file?.location || null;

  try {
    // ---- Duplicate check (unchanged) ----
    const { data: duplicateCheck, error: duplicateError } = await supabase
      .from('events')
      .select('*')
      .eq('title', title)
      .eq('start_datetime', start_datetime)
      .eq('end_datetime', end_datetime);

    if (duplicateError) throw duplicateError;
    if (duplicateCheck.length > 0) {
      return res
        .status(400)
        .json({ error: "An event with the same title and dates already exists." });
    }

    // ---- Insert event (same as before) ----
    const { data: newEvent, error: insertError } = await supabase
      .from('events')
      .insert([
        {
          title,
          start_datetime,
          end_datetime,
          venue_instagram,
          venue_address,
          chef_names: chefNamesArray,
          chef_instagrams: chefInstagramsArray,
          image_url,
          reservation_url,
          english_description,
          hebrew_description
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // ---- Generate embeddings (unchanged) ----
    let english_embedding = null;
    let hebrew_embedding = null;
    try {
      english_embedding = await generateEmbedding(english_description);
      hebrew_embedding = await generateEmbedding(hebrew_description);
    } catch (embeddingError) {
      console.error("Error generating embeddings:", embeddingError);
    }

    // ---- Insert embeddings and get back IDs (CHANGED) ----
    let embedding_id_en = null;
    let embedding_id_he = null;

    try {
      const { data: enRow, error: enErr } = await supabase
        .from('embeddings')
        .insert({
          chef_names: chefNamesArray.join(", "),
          language: 'en',
          description: english_description,
          embedding: english_embedding
        })
        .select()
        .single();

      if (enErr) throw enErr;

      const { data: heRow, error: heErr } = await supabase
        .from('embeddings')
        .insert({
          chef_names: chefNamesArray.join(", "),
          language: 'he',
          description: hebrew_description,
          embedding: hebrew_embedding
        })
        .select()
        .single();

      if (heErr) throw heErr;

      embedding_id_en = enRow.id;
      embedding_id_he = heRow.id;

    } catch (embeddingStoreError) {
      console.error("Error storing embeddings:", embeddingStoreError);
    }

    // ---- Update event with the two embedding IDs (CHANGED) ----
    try {
      await supabase
        .from('events')
        .update({
          embedding_id_en: embedding_id_en,
          embedding_id_he: embedding_id_he
        })
        .eq('id', newEvent.id);
    } catch (linkError) {
      console.error("Error linking embeddings to event:", linkError);
    }

    // ---- Done ----
    console.log("Event successfully added:", newEvent);
    res.json(newEvent);

  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: err.message });
  }
});


// UPDATE event (PUT) with image overwrite
// UPDATE event (PUT) with image overwrite + embedding update
app.put('/api/events/:id', uploadMemory.single("poster"), async (req, res) => {
  console.log("Received PUT /api/events/:id");
  console.log("Request body:", req.body);

  // 1. IMAGE OVERWRITE (unchanged logic, just cleaner)
  if (req.file) {
    console.log("Uploaded file:", req.file);
    let s3_key;

    // Fetch existing image URL
    try {
      const { data, error } = await supabase
        .from('events')
        .select('image_url')
        .eq('id', req.params.id)
        .single();
      if (error) throw error;

      s3_key = data.image_url.split(".amazonaws.com/")[1];
    } catch (err) {
      console.error("Error fetching existing image URL:", err);
      return res.status(500).json({ error: "Failed to fetch existing image URL" });
    }

    // Overwrite S3 object
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3_key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        })
      );
    } catch (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "File upload failed" });
    }
  }

  // 2. FETCH CURRENT EVENT (needed for description + embedding IDs)
  const { data: currentEvent, error: eventErr } = await supabase
    .from('events')
    .select('english_description, hebrew_description, embedding_id_en, embedding_id_he')
    .eq('id', req.params.id)
    .single();

  if (eventErr) {
    console.error("Error fetching current event:", eventErr);
    return res.status(500).json({ error: "Failed to fetch event data" });
  }

  const englishChanged = req.body.english_description !== currentEvent.english_description;
  const hebrewChanged  = req.body.hebrew_description !== currentEvent.hebrew_description;

  let newEnglishEmbedding = null;
  let newHebrewEmbedding = null;

  // 3. GENERATE NEW EMBEDDINGS IF NEEDED
  if (englishChanged || hebrewChanged) {
    console.log("Descriptions changed — generating new embeddings...");

    try {
      if (englishChanged) {
        newEnglishEmbedding = await generateEmbedding(req.body.english_description);
      }
      if (hebrewChanged) {
        newHebrewEmbedding = await generateEmbedding(req.body.hebrew_description);
      }
    } catch (embeddingErr) {
      console.error("Error generating embeddings:", embeddingErr);
    }

    // Update EN embedding
    if (newEnglishEmbedding) {
      await supabase
        .from('embeddings')
        .update({
          description: req.body.english_description,
          embedding: newEnglishEmbedding
        })
        .eq('id', currentEvent.embedding_id_en);
    }

    // Update HE embedding
    if (newHebrewEmbedding) {
      await supabase
        .from('embeddings')
        .update({
          description: req.body.hebrew_description,
          embedding: newHebrewEmbedding
        })
        .eq('id', currentEvent.embedding_id_he);
    }
  } else {
    console.log("Descriptions unchanged — skipping embedding regeneration.");
  }

  // 4. UPDATE EVENT ITSELF
  const {
    title,
    start_datetime,
    end_datetime,
    venue_instagram,
    venue_address,
    chef_names,
    chef_instagrams,
    reservation_url,
    english_description,
    hebrew_description
  } = req.body;

  const chefNamesArray = chef_names
    ? chef_names.split(',').map(name => name.trim())
    : [];

  const chefInstagramsArray = chef_instagrams
    ? chef_instagrams.split(',').map(handle => handle.trim())
    : [];

  const startDate = new Date(start_datetime);
  const endDate = new Date(end_datetime);

  try {
    const { data: updatedEvent, error: updateErr } = await supabase
      .from('events')
      .update({
        title,
        start_datetime: startDate,
        end_datetime: endDate,
        venue_instagram,
        venue_address,
        chef_names: chefNamesArray,
        chef_instagrams: chefInstagramsArray,
        reservation_url,
        english_description,
        hebrew_description
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    console.log("Event successfully updated:", updatedEvent);
    res.json(updatedEvent);

  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: err.message });
  }
});



// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('start_datetime', { ascending: true });

    if (error) throw error;

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete events by titles
app.delete('/api/events', async (req, res) => {
  const { titles } = req.body; 
  if (!Array.isArray(titles) || titles.length === 0) {
    return res.status(400).json({ error: 'Titles must be a non-empty array' });
  }
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .in('title', titles);

    if (error) throw error;

    const { data: updatedEvents, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('start_datetime', { ascending: true });

    if (fetchError) throw fetchError;

    res.status(200).json({ message: 'Events deleted successfully', events: updatedEvents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


