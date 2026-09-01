// src/utils/embed-transformer.js
const fetch = require('node-fetch'); // Standard Node fetch for Gatsby build environments
const cheerio = require('cheerio');   // Light HTML parser to scrape Open Graph tags

module.exports = {
  name: 'MultiPlatformSocialCards',

  // Decide which isolated links get transformed
  shouldTransform(url) {
    const { host } = new URL(url);
    // Add any domain you want to capture automatically
    const supportedDomains = [
        'github.com',
        'linkedin.com',
        'x.com',
        'twitter.com',
        'wikipedia.org',
        'github.io',
    ];
    return supportedDomains.some(
        domain => host.endsWith(domain))
        || host.includes('your-favorite-blog.com'
    );
  },

  // Process the link at build-time and generate the HTML card
  async getHTML(url) {
    const parsedUrl = new URL(url);
    const host = parsedUrl.host;

    // --- CASE A: SPECIFIC OPTIMIZATION FOR GITHUB REPOSITORIES ---
    if (host.includes('github.com')) {
      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathSegments.length === 2) { // Exact repository match (user/repo)
        const [owner, repo] = pathSegments;
        try {
          const res = await fetch(`https://github.com{owner}/${repo}`);
          if (res.ok) {
            const data = await res.json();
            return `
              <div class="social-preview-card github-card">
                <a href="${url}" target="_blank" rel="noopener noreferrer">
                  <div class="card-body">
                    <h4>${owner} / ${repo}</h4>
                    <p>${data.description || 'View repository on GitHub'}</p>
                    <span class="card-meta">⭐ ${data.stargazers_count} stars • github.com</span>
                  </div>
                </a>
              </div>
            `;
          }
        } catch (e) {
          console.error(`Build Error fetching GitHub API data for ${url}:`, e);
        }
      }
    }

    // --- CASE B: FALLBACK TO SCRAPING OPEN GRAPH (For LinkedIn, Blogs, etc.) ---
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'GatsbySocialBot/1.0' } });
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract standard social media open graph markup
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || url;
        const description = $('meta[property="og:description"]').attr('content') || 'Click to view the link content.';
        const image = $('meta[property="og:image"]').attr('content') || '';

        return `
          <div class="social-preview-card general-card">
            <a href="${url}" target="_blank" rel="noopener noreferrer">
              ${image ? `<img src="${image}" alt="${title}" class="card-image" />` : ''}
              <div class="card-body">
                <h4>${title}</h4>
                <p>${description}</p>
                <span class="card-meta">${parsedUrl.hostname}</span>
              </div>
            </a>
          </div>
        `;
      }
    } catch (err) {
      console.error(`Could not crawl metadata for ${url}:`, err);
    }

    // Default basic fallback link if everything fails
    return `<a href="${url}" class="fallback-link" target="_blank">${url}</a>`;
  }
};
