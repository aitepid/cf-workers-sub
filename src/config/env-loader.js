/**
 * Load and merge config from Cloudflare Worker environment variables
 */
export function loadConfig(env, hostname) {
    const config = { ...DEFAULT_CONFIG };
    
    // Override from environment variables
    if (env.UUID) config.uuid = env.UUID;
    if (env.PROXYIP) {
        config.proxyIPs = env.PROXYIP.split(',').map(s => s.trim()).filter(Boolean);
        config.defaultProxyIP = config.proxyIPs[0];
    }
    if (env.SUB_PATH) config.subPath = env.SUB_PATH;
    if (env.HOST) {
        config.host = env.HOST.split(',').map(h => h.trim())[0];
    }
    if (env.TLS_FINGERPRINT) config.tlsFingerprint = env.TLS_FINGERPRINT;
    if (env.SNI) config.sni = env.SNI;
    if (env.ALLOW_INSECURE === '1') config.allowInsecure = true;
    if (env.PREVENT_CONCURRENT !== undefined) {
        config.preventConcurrent = parseInt(env.PREVENT_CONCURRENT);
    }
    if (env.DNS_ADDR) config.dnsAddr = env.DNS_ADDR;
    if (env.DNS_DOMAIN) config.dnsDomain = env.DNS_DOMAIN;
    if (env.FAKE_DNS_IPS) config.fakeDNSIPs = env.FAKE_DNS_IPS.split(',');
    if (env.FAKE_DNS_DOMAINS) config.fakeDNSDomains = env.FAKE_DNS_DOMAINS.split(',');
    
    return config;
}
