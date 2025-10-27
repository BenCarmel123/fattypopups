// Config and imports
const express = require('express');
const cors = require('cors');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { checkDuplicateEvent, insertEvent, insertEmbedding } = require('./queries');
const createEventEmbedding  = require('./agent.js');
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

// Logging middleware
app.use((req, res, next) => {
  console.log(` Incoming ${req.method} ${req.url}`);
  next();
});

// DB 
const supabase = createClient(process.env.DATABASE_PROD_URL, process.env.SUPABASE_KEY);
// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, 
    key: function (req, file, cb) {
      cb(null, `posters/${Date.now()}-${file.originalname}`); // file path in S3
    }
  })
});

app.get('/', (req, res) => {
  res.send(' FattyPopups backend is running!');
});


// Routes
app.get('/' + process.env.ADMIN_ROUTE, async (req, res) => {
    try {
            res.json({ message: 'Admin route reached!' });
            const events = await pool.query('SELECT * FROM events');
            res.json(events.rows);
        }
catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Add new event 
app.post('/api/events', upload.single("poster"), async (req, res) => {
  console.log("🔥 Received POST /api/events");
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
      ]);

    if (insertError) throw insertError;

    try {
      const unified_description = english_description + " " + hebrew_description;
      const embedding = await createEventEmbedding(
        chefNamesArray.join(", "),
        venue_address,
        english_description
      );

      const { error: embeddingError } = await supabase
        .from('embeddings')
        .insert([
          {
            chef_names: chefNamesArray.join(", "),
            venue_address,
            unified_description,
            embedding
          }
        ]);

      if (embeddingError) throw embeddingError;
    } catch (embeddingError) {
      console.error("❌ Error creating embedding:", embeddingError);
    }

    console.log("✅ Event successfully added:", newEvent);
    res.json(newEvent);
  } catch (err) {
    console.error("❌ Error adding event:", err);
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
    const { data, error } = await supabase
      .from('events')
      .delete()
      .in('title', titles);

    if (error) throw error;

    res.status(200).json({ message: 'Events deleted successfully', events: titles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route to verify Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('events').select('*').limit(1);

    if (error) {
      console.error('❌ Supabase connection error:', error);
      return res.status(500).json({ error: 'Supabase connection failed', details: error.message });
    }

    res.status(200).json({ message: 'Supabase connection successful', data });
  } catch (err) {
    console.error('❌ Unexpected error during Supabase test:', err);
    res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
});

