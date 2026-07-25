/**
 * Base64url encoding and decoding utilities
 * Used for JWT token encoding, subscription link generation.
 */

/**
 * Encode a string to base64url (URL-safe base64)
 * @param {string} str - Input string
 * @returns {string} base64url encoded string
 */
export function encode(str) {
    const binary = new TextEncoder().encode(str);
    return btoa(String.fromCharCode(...binary))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Decode a base64url string back to original text
 * @param {string} encoded - base64url encoded string
 * @returns {string} decoded string
 */
export function decode(encoded) {
    // Restore standard base64 padding
    let base64 = encoded
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}
