const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
const apiKey = process.env.NEWS_API_KEY;

app.get('/api/article', async (req, res) => {
    const title = req.query.title;
    if (!title) {
        return res.status(400).json({ error: 'Missing article title' });
    }

    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&apiKey=${apiKey}`);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// New route for top headlines (no key needed in frontend)
app.get('/api/headlines', async (req, res) => {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching headlines:', error);
        res.status(500).json({ error: 'Failed to fetch headlines' });
    }
});

app.use(express.static('public', {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
