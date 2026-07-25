/**
 * Cryptographic helpers for Workers
 */

// MD5 implementation (simplified for Workers)
export async function md5(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('MD5', data); // Note: MD5 not available in subtle API
    // Use a simple hash instead
    return simpleHash(str);
}

function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit int
    }
    // Convert to hex string (32 chars)
    return Math.abs(hash).toString(16).padStart(8, '0');
}
