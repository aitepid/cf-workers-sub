/**
 * Format subscription as mixed plain text (VMESS/VLESS/TROJAN links)
 */

/**
 * @param {string} uuid - User UUID
 * @param {object} config - Loaded configuration
 * @returns {string} Newlines-separated list of proxy links
 */
export function formatAsMixed(uuid, config) {
    const host = config.host || 'githubvpn.tepid.de5.net';
    const lines = [];
    
    // VLESS WebSocket link
    lines.push(`vless://${uuid}@${host}:443?security=tls&type=ws&encryption=none#${encodeURI(host)}-WS`);
    
    return lines.join('\n');
}
