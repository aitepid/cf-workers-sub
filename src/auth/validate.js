/**
 * Password validation logic
 */

/**
 * Validate the provided password against the stored password hash
 * @param {string} inputPassword - Password from user
 * @param {string} storedPasswordHash - Expected password (hashed)
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePassword(inputPassword, storedPasswordHash) {
    if (!inputPassword || !storedPasswordHash) {
        return { valid: false, error: 'Missing password' };
    }
    
    // Simple comparison (in production, use bcrypt or similar)
    // For now we assume storedPasswordHash is already hashed
    const inputHash = simpleHash(inputPassword);
    
    if (inputHash === storedPasswordHash) {
        return { valid: true };
    }
    
    return { valid: false, error: 'Invalid password' };
}

/**
 * Simple hash function (for demo/testing; use real hashing in production)
 * @param {string} str
 * @returns {string}
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // Convert to hex and pad
    return Math.abs(hash).toString(16).padStart(8, '0');
}
