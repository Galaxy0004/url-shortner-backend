// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
const Url = require('./models/url.model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://url-shortener-frontend-liard-one.vercel.app']; // Add your live URL later

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

// --- API Routes ---

// POST /api/shorten: Create a new short URL
app.post('/api/shorten', async (req, res) => {
    const { original_url } = req.body;

    // Simple validation
    if (!original_url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Check if the URL is already in the database
        let url = await Url.findOne({ original_url });

        if (url) {
            res.json(url);
        } else {
            const short_code = shortid.generate();
            const newUrl = new Url({
                original_url,
                short_code,
            });

            await newUrl.save();
            res.json(newUrl);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /:shortcode: Redirect to the original URL
app.get('/:shortcode', async (req, res) => {
    try {
        const url = await Url.findOne({ short_code: req.params.shortcode });

        if (url) {
            // Increment the clicks counter
            url.clicks++;
            await url.save();
            
            // Redirect to the original URL
            return res.redirect(url.original_url);
        } else {
            return res.status(404).json({ error: 'No URL found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/urls', async (req, res) => {
    const authHeader = req.headers['authorization'];
    
    // The header should be in the format "Bearer my-super-secret..."
    const token = authHeader && authHeader.split(' ')[1]; 


    if (token !== process.env.SECRET_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid Token' });
    }

    try {
        const urls = await Url.find();
        res.json(urls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Credentials are correct, send back the secret key as a token
        res.json({ success: true, token: process.env.SECRET_KEY });
    } else {
        // Incorrect credentials
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));