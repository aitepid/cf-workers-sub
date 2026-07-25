/**
 * VLESS protocol parser and encoder
 * Implements the wire format defined in VLESS specification.
 */

/**
 * Parse a VLESS request from an HTTP Upgrade request
 * @param {Request} request - The HTTP upgrade request
 * @param {string} expectedUuid - The expected UUID from env.UUID
 * @returns {{ valid: boolean, error?: string, uuid?: string, host?: string, path?: string, encryption?: string }}
 */
export function parseVlessRequest(request, expectedUuid) {
    try {
        const url = new URL(request.url);
        
        // Extract resource path (format: /{uuid}/... or /link?...)
        const parts = url.pathname.split('/').filter(Boolean);
        
        if (parts.length === 0) {
            return { valid: false, error: 'No resource path' };
        }
        
        const resourceId = parts[0];
        const uuid = resourceId;
        
        if (!uuid || uuid !== expectedUuid) {
            return { valid: false, error: 'Invalid UUID' };
        }
        
        // Check WebSocket upgrade
        const upgradeHeader = request.headers.get('upgrade')?.toLowerCase();
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return { valid: false, error: 'Expected WebSocket upgrade' };
        }
        
        // Get transport type
        const transportType = url.searchParams.get('type') || 'ws';
        const host = url.searchParams.get('host') || url.hostname;
        let path = url.searchParams.get('path') || '/' + uuid;
        
        // Add query parameters for WebSocket path
        const edParam = url.searchParams.get('ed') || '2048';
        if (!path.includes('?')) {
            path += '?ed=' + edParam;
        }
        
        return {
            valid: true,
            uuid,
            host,
            path,
            transportType,
            encryption: url.searchParams.get('encryption') || 'none',
            security: url.searchParams.get('security') || 'tls',
            sid: url.searchParams.get('id') || ''
        };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}
