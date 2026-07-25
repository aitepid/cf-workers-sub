/**
 * Cookie management utilities
 */

/**
 * Set authentication cookie
 * @param {string} value - Cookie value
 * @param {object} options - Cookie options (maxAge, path, etc.)
 * @returns {string[]} Set-Cookie header value(s)
 */
export function setCookie(value, options = {}) {
    const defaults = {
        path: '/',
        maxAge: 86400, // 24 hours in seconds
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    };
    
    const opts = { ...defaults, ...options };
    
    let cookieStr = `${opts.name || 'session'}=${value}; Path=${opts.path}; Max-Age=${opts.maxAge}; HttpOnly; Secure; SameSite=${opts.sameSite}`;
    
    return [cookieStr];
}

/**
 * Clear authentication cookie
 * @param {object} options - Cookie options matching setCookie
 * @returns {string[]}
 */
export function clearCookie(options = {}) {
    return setCookie('', { ...options, maxAge: 0 });
}
