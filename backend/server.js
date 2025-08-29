// Config and imports
const { ADMIN_ROUTE } = require('../frontend/src/adminRoute');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
    const { title, description, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, image_url, reservation_url } = req.body;
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

