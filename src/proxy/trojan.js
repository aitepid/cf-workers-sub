/**
 * Trojan protocol parser
 */

/**
 * Parse a Trojan authentication request
 * @param {string} password - The expected Trojan password
 * @param {Request} request
 * @returns {{ valid: boolean, error?: string }}
 */
export function parseTrojanRequest(request, password) {
    // Trojan uses TCP first, then TLS handshake happens at application layer
    // For WS transport, it's similar to VLESS WS
    try {
        const url = new URL(request.url);
        
        // Check for Trojan auth header or path-based auth
        const authHeader = request.headers.get('Authorization');
        const pathParts = url.pathname.split('/').filter(Boolean);
        
        if (pathParts.length > 0 && pathParts[0] === password) {
            return { valid: true };
        }
        
        return { valid: false, error: 'Invalid Trojan password' };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}
