// Fetch headlines from backend
async function fetchArticles() {
    const response = await fetch('/api/headlines');
    const data = await response.json();
    return data.articles;
}

export async function buildHeadline() {
    let articlesEl = document.getElementById('articles');

    try {
        const articles = await fetchArticles();

        if (!articles || articles.length === 0) {
            articlesEl.innerHTML = `<p>No articles found.</p>`;
            return;
        }

        articlesEl.innerHTML = '';
        articles.forEach(article => {
            const headlineContent = `
            <div class="headline">
                <h2><a href="article.html?title=${encodeURIComponent(article.title)}">${article.title}</a></h2>
                <p>${article.description || ''}</p>
            </div>
            `;
            articlesEl.innerHTML += headlineContent;
        });

    } catch (error) {
        console.error(error);
    }
}

// Fetch article from API by title (from backend)
async function fetchArticle(title) {
    try {
        const response = await fetch(`/api/article?title=${encodeURIComponent(title)}`);
        const data = await response.json();

        if (data && data.articles && data.articles.length > 0) {
            return data.articles[0]; // return the first matching article
        } else {
            throw new Error('No article found');
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
    }
}

// Display article content
function showArticle(article) {
    const articleEl = document.createElement('div');
    articleEl.classList.add('article');
    articleEl.innerHTML = `
        <h2 id="article-title">${article.title}</h2>
        <p id="article-author"><strong>By ${article.author || 'Unknown author'}</strong> - ${new Date(article.publishedAt).toLocaleString()}</p>
        <p id="article-description">${article.description || ''}</p>
        <p id="article-content">${article.content || ''}</p>
        <a href="${article.url}" target="_blank" id="article-link">Read full article</a>
    `;

    return articleEl;
}

// Main builder function
export async function buildArticle() {
    const params = new URLSearchParams(window.location.search);
    const articleTitle = params.get('title');

    const contentEl = document.getElementById('content');

    if (!articleTitle) {
        contentEl.innerHTML = `<p>Invalid article link.</p>`;
        return;
    }

    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        contentEl.innerHTML = `<h2>Please <a href="/login">login</a> to view this article.</h2>`;
        return;
    } else {
        try {
            const article = await fetchArticle(articleTitle);
            contentEl.innerHTML = '';
            contentEl.appendChild(showArticle(article));
        } catch (error) {
            contentEl.innerHTML = `<p>Unable to load the article.</p>`;
        }
    }
}


async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.authenticated === true;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
}


export async function Nav() {
    const navEl = document.createElement("nav");

    const authorized = await checkAuth();

    if (authorized) {
        navEl.innerHTML = `
        <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/logout" class="login_btn">Logout</a></li>
        </ul>
        `;
    } else {
        navEl.innerHTML = `
        <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login" class="login_btn">Login</a></li>
        </ul>
        `;
    }

    return navEl;
};