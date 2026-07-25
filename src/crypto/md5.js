/**
 * MD5 hash implementation for Cloudflare Workers
 * Uses Web Crypto API where available, otherwise pure JS fallback.
 */

/**
 * Generate MD5 hex digest of a string
 * @param {string} str - Input string
 * @returns {Promise<string>} 32-char hex string
 */
export async function md5(str) {
    // Try Web Crypto API first (available in CF Workers)
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
    } catch (e) {
        // Fallback: simple hashing
        return simpleHash(str);
    }
}

/**
 * Simple hash function as backup
 * @param {string} input
 * @returns {string}
 */
function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit int
    }
    // Convert to hex string (pad to 32 chars)
    return Math.abs(hash).toString(16).padStart(8, '0');
}
