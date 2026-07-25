/**
 * Parse subscription request parameters from URL query string
 */

/**
 * @param {string} queryString - The ?key=value&key2=value2 part of URL
 * @returns {{ format: 'singbox'|'clash'|'mixed', type?: string, uuid?: string }}
 */
export function parseParams(queryString) {
    const params = new URLSearchParams(queryString);
    
    const format = (params.get('format') || params.get('type') || 'mixed').toLowerCase();
    const subFormat = params.get('sub'); // singbox, clash, mixed, vless
    
    const resolvedFormat = subFormat || format;
    
    return {
        format: ['singbox', 'clash', 'mixed', 'vless', 'trojan'].includes(resolvedFormat) 
            ? resolvedFormat 
            : 'mixed',
        type: params.get('type'),
        uuid: params.get('uuid'),
        host: params.get('host'),
        port: parseInt(params.get('port')) || 443
    };
}
