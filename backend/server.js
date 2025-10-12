// Config and imports
const { ADMIN_ROUTE } = require('../frontend/src/adminRoute.js');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
require('dotenv').config();
const { generateEventDescriptions } = require('./agent.js');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Logging middleware
app.use((req, res, next) => {
  console.log(`🛰️ Incoming ${req.method} ${req.url}`);
  next();
});


// DB 
const { Pool } = require('pg');
const pool = new Pool({connectionString: process.env.DATABASE_URL,}); 

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routes
app.get('/' + ADMIN_ROUTE, async (req, res) => {
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
    // Generate event description using AI (stub for now)
    //let Ai_response = await generateEventDescriptions(req.body.chef_names, req.body.venue_address);
    //let descriptionJSON = JSON.parse(Ai_response.output_text);
    //const description = descriptionJSON.english_description + "\n\n" + descriptionJSON.hebrew_description;
    console.log("🔥 Received POST /api/events");
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    const { title ,start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, reservation_url, english_description, hebrew_description } = req.body;
    const image_url = req.file.location; // S3 URL of the uploaded image
    try {
        // Convert comma-separated strings to PostgreSQL-friendly arrays
        const chefNamesArray = req.body.chef_names ? req.body.chef_names.split(',').map(name => name.trim()): [];
        const chefInstagramsArray = req.body.chef_instagrams ? req.body.chef_instagrams.split(',').map(handle => handle.trim()): [];
        const {
                title,
                start_datetime,
                end_datetime,
                venue_instagram,
                venue_address,
                reservation_url,
                english_description,
                hebrew_description
                } = req.body;
            // S3 file location
            const image_url = req.file?.location || null;
        const newEvent = await pool.query(
            `INSERT INTO events (
            title,
            start_datetime,
            end_datetime,
            venue_instagram,
            venue_address,
            chef_names,
            chef_instagrams,
            image_url,
            reservation_url,
            english_description,
            hebrew_description
            ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
            ) RETURNING *`,
            [
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
            ]
        );
        console.log("Event successfully added to DB:", newEvent.rows[0]);
        res.json(newEvent.rows[0]);
        } catch (err) {
        console.error("Ben there's an Error adding event:", err);
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

