/**
 * Default proxy configuration
 */
export const DEFAULT_CONFIG = {
    // Proxy settings
    protocols: ['vless-ws'],       // Supported protocols
    port: 443,                     // HTTPS port
    host: 'githubvpn.tepid.de5.net', // Host header
    
    // Subscriptions
    subPath: 'link',               // Subscription URL path
    supportFormats: ['sing-box', 'clash-meta', 'mixed', 'surge'],
    
    // TLS settings
    tlsFingerprint: 'firefox',     // Fake SNI fingerprint
    acceptEncryptions: ['none'],   // Accept encryption types
    
    // WebSocket
    wsMaxLatency: 100,            // Max latency in ms
    wsHeartbeatInterval: 30,      // Seconds between heartbeats
    
    // Routing
    defaultProxyIP: '',           // Empty = use direct connection
    proxyIPs: [],                 // Override list
    
    // Best-IP settings
    bestIP: true,                 // Enable IP benchmarking
    probeURLs: [                  // URLs to probe for best IP
        'https://www.gstatic.com/generate_204',
        'https://captive.apple.com/hotspot-detect.html',
        'https://1.1.1.1/cdn-cgi/trace'
    ]
};
