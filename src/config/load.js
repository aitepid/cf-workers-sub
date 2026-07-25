/**
 * Load and merge configuration from Cloudflare Worker environment variables
 * Falls back to defaults.js for any missing values.
 */
import { DEFAULT_CONFIG } from './defaults.js';

export function loadConfig(env) {
    const config = { ...DEFAULT_CONFIG };
    
    // Override with environment variables (if present and non-empty)
    if (env.UUID || env.uuid) {
        config.uuid = env.UUID || env.uuid;
    }
    if (env.PROXYIP || env.proxyip || env.PROXY_IP) {
        const raw = env.PROXYIP || env.proxyip || env.PROXY_IP;
        config.proxyIPs = raw.split(',').map(s => s.trim()).filter(Boolean);
        config.defaultProxyIP = config.proxyIPs[0];
    }
    if (env.SUB_PATH || env.subpath || env.SUBPATH) {
        config.subPath = env.SUB_PATH || env.subpath || env.SUBPATH;
    }
    if (env.HOST || env.host) {
        const hosts = (env.HOST || env.host).split(',').map(h => h.trim());
        config.host = hosts[0] || '';
        config.sni = hosts[hosts.length - 1] || config.sni;
    }
    if (env.TLS_FINGERPRINT || env.fingerprint) {
        config.tlsFingerprint = env.TLS_FINGERPRINT || env.fingerprint;
    }
    if (env.SNI) {
        config.sni = env.SNI;
    }
    if (env.ALLOW_INSECURE === '1' || env.allowInsecure === 'true') {
        config.allowInsecure = true;
    }
    if (env.PREVENT_CONCURRENT !== undefined) {
        config.preventConcurrent = parseInt(env.PREVENT_CONCURRENT, 10);
    }
    if (env.DNS_ADDR) {
        config.dnsAddr = env.DNS_ADDR;
    }
    if (env.DNS_DOMAIN) {
        config.dnsDomain = env.DNS_DOMAIN;
    }
    if (env.FAKE_DNS_IPS) {
        config.fakeDNSIPs = env.FAKE_DNS_IPS.split(',');
    }
    if (env.FAKE_DNS_DOMAINS) {
        config.fakeDNSDomains = env.FAKE_DNS_DOMAINS.split(',');
    }
    if (env.MAX_CONN_PER_IP) {
        config.maxConnectionsPerIp = parseInt(env.MAX_CONN_PER_IP, 10);
    }
    if (env.RATE_LIMIT) {
        config.rateLimitPerMinute = parseInt(env.RATE_LIMIT, 10);
    }
    
    return config;
}
