const express = require('express');
const app = express();
require('dotenv').config();
const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_CONFIG_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH_CONFIG_CLIENT,
    issuerBaseURL: 'https://dev-4e58fapyk1mxc5ih.us.auth0.com'
}

app.use(auth(config));

app.get('/api/check-auth', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.json({ authenticated: true, user: req.oidc.user });
    } else {
        res.json({ authenticated: false });
    }
});

app.get('/profile', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.json({ user: req.oidc.user.nickname });
    } else {
        res.json({ user: null });
    }
});

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
