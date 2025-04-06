const apiKey = 'b1441609e32c4a419e7bdd7b9c5c2786';

async function fetchArticles() {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
}

export async function buildHeadline() {
    const articlesEl = document.createElement('div');
    articlesEl.classList.add('articles');

    try {
        const articles = await fetchArticles();

        if (articles.length === 0) {
            articlesEl.innerHTML = `<p>No articles found.</p>`;
            document.querySelector('home').appendChild(articlesEl);
            return;
        }

        articles.forEach(article => {
            const headlineEl = document.createElement('article');
            headlineEl.innerHTML = `
                <h2><a href="article.html?title=${encodeURIComponent(article.title)}">${article.title}</a></h2>
                <p>${article.description}</p>
            `;
            articlesEl.appendChild(headlineEl);
        });

    } catch (error) {
        console.error(error);
    }

    document.querySelector('#home').appendChild(articlesEl);
}

// Fetch article from API by title
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

// Display the article natively
function showArticle(article) {
    const articleEl = document.createElement('article');
    articleEl.innerHTML = `
        <h1>${article.title}</h1>
        <p><strong>By ${article.author || 'Unknown author'}</strong> - ${new Date(article.publishedAt).toLocaleString()}</p>
        <p>${article.description || ''}</p>
        <p>${article.content || ''}</p>
        <a href="${article.url}" target="_blank">Read full article</a>
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

    try {
        // Optional: Check auth
        // const res = await fetch('/api/check-auth');
        // const authData = await res.json();
        // if (!authData.authenticated) {
        //     window.location.href = '/login.html';
        //     return;
        // }

        const article = await fetchArticle(articleTitle);
        contentEl.innerHTML = '';
        contentEl.appendChild(showArticle(article));

    } catch (error) {
        contentEl.innerHTML = `<p>Unable to load the article.</p>`;
    }
}
