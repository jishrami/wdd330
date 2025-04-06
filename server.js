const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

app.get('/api/article', async (req, res) => {
    const title = req.query.title;
    if (!title) {
        return res.status(400).json({ error: 'Missing article title' });
    }

    try {
        const apiKey = process.env.NEWS_API_KEY; // Replace with your actual NewsAPI key
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&apiKey=${apiKey}`);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
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
