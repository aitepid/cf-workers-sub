/**
 * Random value generators for configuration and security.
 */

/**
 * Generate a random UUID v4 string
 * @returns {string} e.g., '550e8400-e29b-41d4-a716-446655440000'
 */
export function randomUUID() {
    return crypto.randomUUID();
}

/**
 * Generate a random IP address (0.0.0.0 - 255.255.255.255)
 * @returns {string} e.g., '45.123.89.67'
 */
export function randomIP() {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

/**
 * Generate a random string of given length using alphanumeric chars
 * @param {number} length - String length (default 16)
 * @returns {string} Random alphanumeric string
 */
export function randomString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
