/**
 * Generate subscription links for all supported protocols
 */

const PROTOCOLS = ['vless-ws', 'trojan-ws'];

/**
 * @param {object} config - Loaded configuration object
 * @param {string} uuid - User UUID
 * @returns {{ vless: string[], trojan: string[] }}
 */
export function generateLinks(config, uuid) {
    const host = config.host || 'githubvpn.tepid.de5.net';
    const port = config.port || 443;
    const proxyIPs = config.proxyIPs || [host];
    
    const links = [];
    
    // VLESS WebSocket links
    for (const ip of proxyIPs) {
        links.push(
            `vless://${uuid}@${ip}:${port}?security=tls&type=ws&encryption=none#${escapeHtml(ip)}`
        );
    }
    
    return links;
}

/**
 * URL-escape node name to prevent injection
 */
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
}
