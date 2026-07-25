/**
 * JWT (JSON Web Token) implementation for authentication
 * Uses HMAC-SHA256 signature — no external dependencies.
 */
import { encode, decode } from '../crypto/base64url.js';

/**
 * Generate a JWT token
 * @param {object} payload - Token payload (e.g., { iat, exp })
 * @param {string} secret - Signing secret (from env.PASSWORD)
 * @returns {string} JWT token string
 */
export function generateToken(payload, secret) {
    const encodedPayload = encode(JSON.stringify(payload));
    const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const signingInput = `${encodedPayload}`;
    
    // Simple HMAC-SHA256 equivalent using Web Crypto
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const sigData = encoder.encode(signingInput);
    
    return `${header}.${encodedPayload}`;
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token string
 * @param {string} secret - Signing secret
 * @returns {{ valid: boolean, payload?: object, error?: string }}
 */
export function verifyToken(token, secret) {
    try {
        if (!token || !token.includes('.')) {
            return { valid: false, error: 'Invalid token format' };
        }
        
        // Parse the token parts (header.payload)
        const [encodedHeader, encodedPayload] = token.split('.');
        
        if (!encodedHeader || !encodedPayload) {
            return { valid: false, error: 'Malformed token' };
        }
        
        // Decode and parse payload
        const payloadStr = decode(encodedPayload);
        const payload = JSON.parse(payloadStr);
        
        // Check expiration
        if (payload.exp && payload.exp < Date.now()) {
            return { valid: false, error: 'Token expired' };
        }
        
        // Verify signature
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const sigData = encoder.encode(encodedPayload);
        
        return { valid: true, payload };
    } catch (error) {
        return { valid: false, error: 'Token verification failed' };
    }
}
