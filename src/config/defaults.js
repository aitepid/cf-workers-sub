/**
 * Default proxy configuration
 * All defaults that can be overridden by environment variables
 */

export const DEFAULT_CONFIG = {
    // --- Core ---
    uuid: '5dc15e15-f285-4a9d-959b-0e4fbdd77b63',
    password: null,
    
    // --- Proxy ---
    protocols: ['vless-ws'],          // supported protocol list
    port: 443,                        // HTTPS port
    host: '',                         // server domain (from env.HOST)
    sni: '',                          // TLS SNI (default = host if empty)
    proxyIPs: [],                     // override IPs
    defaultProxyIP: '',               // primary proxy IP
    
    // --- Subscriptions ---
    subPath: 'link',                  // subscription URL path prefix
    
    // --- TLS ---
    tlsFingerprint: 'firefox',        // fake SNI fingerprint
    allowInsecure: false,
    
    // --- WebSocket ---
    wsMaxLatency: 100,                // ms
    wsHeartbeatInterval: 30,          // seconds
    
    // --- Connection limits ---
    maxConnectionsPerIp: 10,          // env.MAX_CONN_PER_IP
    rateLimitPerMinute: 60,           // env.RATE_LIMIT
    
    // --- DNS ---
    dnsAddr: null,                    // custom DNS resolver address
    dnsDomain: null,                  // custom DNS domain
    fakeDNSIPs: null,                 // array of fake DNS IPs
    fakeDNSDomains: null,             // array of fake DNS domains
    
    // --- Best-IP ---
    bestIP: true,
    probeURLs: [
        'https://www.gstatic.com/generate_204',
        'https://captive.apple.com/hotspot-detect.html',
        'https://1.1.1.1/cdn-cgi/trace'
    ]
};
