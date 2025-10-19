// Config and imports
const express = require('express');
const cors = require('cors');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { checkDuplicateEvent, insertEvent, insertEmbedding } = require('./queries');
require('dotenv').config({ path: '../.env' });
const createEventEmbedding  = require('./agent.js');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
// Middleware
app.use(cors());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_PROD_URL],
}));
app.use(express.json()); // Parse JSON bodies

// Logging middleware
app.use((req, res, next) => {
  console.log(` Incoming ${req.method} ${req.url}`);
  next();
});

// DB 

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
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
    const duplicateCheck = await pool.query(checkDuplicateEvent, [
      title,
      start_datetime,
      end_datetime
    ]);

    if (duplicateCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "An event with the same title and dates already exists." });
    }

    const newEvent = await pool.query(insertEvent, [
      title,
      start_datetime,
      end_datetime,
      venue_instagram,
      venue_address,
      chefNamesArray,
      chefInstagramsArray,
      image_url,
      reservation_url,
      english_description,
      hebrew_description
    ]);

    try {
        const unified_description = english_description + " " + hebrew_description;
        const embedding = await createEventEmbedding(
        chefNamesArray.join(", "),
        venue_address,
        english_description
        );

        await pool.query(insertEmbedding, [
        chefNamesArray.join(", "),
        venue_address,
        unified_description,
        embedding
        ]);
    } catch (embeddingError) {
        console.error("❌ Error creating embedding:", embeddingError);
    }

    console.log("✅ Event successfully added:", newEvent.rows[0]);
    res.json(newEvent.rows[0]);
  } catch (err) {
    console.error("❌ Error adding event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events ORDER BY start_datetime ASC');
        res.json(events.rows);
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
        const deleteQuery = 'DELETE FROM events WHERE title = ANY($1::text[])';
        await pool.query(deleteQuery, [titles]);
        res.status(200).json(
            { message: 'Events deleted successfully', 
                events: titles});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

