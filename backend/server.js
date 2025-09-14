// Config and imports
const { ADMIN_ROUTE } = require('../frontend/src/adminRoute.js');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { generateEventDescriptions } = require('./agent.js');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// DB 
const { Pool } = require('pg');
const pool = new Pool({connectionString: process.env.DATABASE_URL,}); 

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
app.post('/api/events', async (req, res) => {
    let Ai_response = await generateEventDescriptions(req.body.chef_names, req.body.venue_address);
    let descriptionJSON = JSON.parse(Ai_response.output_text);
    const description = descriptionJSON.english_description;
    const { title ,start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, image_url, reservation_url } = req.body;
    try {
        const newEvent = await pool.query(
            'INSERT INTO events (title, description, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, image_url, reservation_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [title, description, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, image_url, reservation_url]
        );
        res.json(newEvent.rows[0]);
    } catch (err) {
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

