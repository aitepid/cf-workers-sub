/**
 * Bot user-agent detection
 * Returns true if the request appears to come from a search engine bot or crawler.
 */

const BOT_AGENTS = [
    'googlebot', 'bingbot', 'yandex', 'baiduspider',
    'facebookexternalhit', 'twitterbot', 'rogerbot',
    'linkedinbot', 'embedly', 'showyoubot',
    'platformog', 'w3c_validator', 'pinterest',
    'slackbot', 'vkShare', 'TencentTraveler',
    'Sogou', 'Webdup', 'Applebot'
];

/**
 * Check if a User-Agent header belongs to a known bot/crawler
 * @param {string|undefined} userAgent
 * @returns {boolean}
 */
export function isBot(userAgent) {
    if (!userAgent) return false;
    const lower = userAgent.toLowerCase();
    return BOT_AGENTS.some(agent => lower.includes(agent));
}
