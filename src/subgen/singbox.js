/**
 * Format subscription links as Sing-box JSON configuration
 */

/**
 * @param {string} uuid - User UUID
 * @param {object} config - Loaded configuration
 * @returns {string} JSON-formatted sing-box config
 */
export function formatAsSingBox(uuid, config) {
    const host = config.host || 'githubvpn.tepid.de5.net';
    
    const configObj = {
        inbounds: [],
        outbounds: [
            {
                type: "vless",
                tag: "proxy",
                server: host,
                server_port: 443,
                uuid: uuid,
                flow: "",
                packet_encoding: "xudp",
                tls: {
                    enabled: true,
                    server_name: host,
                    insecure: false,
                    utls: {
                        enabled: true,
                        fingerprint: config.tlsFingerprint || "firefox"
                    }
                },
                transport: {
                    type: "ws",
                    path: `/${uuid}/?ed=2048`,
                    headers: {
                        Host: host
                    }
                }
            },
            { type: "direct", tag: "direct" },
            { type: "dns", tag: "dns-out" }
        ],
        route: {
            rules: [
                { protocol: "dns", outbound: "dns-out" },
                { ip_is_private: true, outbound: "direct" },
                { clash_mode: "direct", outbound: "direct" },
                { clash_mode: "global", outbound: "proxy" }
            ],
            final: "proxy"
        },
        experimental: {
            cache_file: {
                enabled: true,
                path: "cache.db",
                store_fakeip: true
            }
        }
    };
    
    return JSON.stringify(configObj, null, 2);
}
