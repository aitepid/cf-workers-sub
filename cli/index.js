/**
 * CLI entry point for cf-workers-sub management
 * Usage: node cli/index.js <command> [options]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

// Config file path
const CONFIG_PATH = join(process.env.HOME || process.env.USERPROFILE || '', '.cf-proxy', 'config.json');

/**
 * Load config from ~/.cf-proxy/config.json
 */
function loadConfig() {
    try {
        if (existsSync(CONFIG_PATH)) {
            const raw = readFileSync(CONFIG_PATH, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.error('Failed to load config:', e.message);
    }
    return null;
}

/**
 * Save config to ~/.cf-proxy/config.json
 */
function saveConfig(config) {
    const dir = join(process.env.HOME || process.env.USERPROFILE || '', '.cf-proxy');
    if (!existsSync(dir)) {
        import('fs').then(fs => fs.mkdirSync(dir, { recursive: true }));
    }
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`Config saved to ${CONFIG_PATH}`);
}

/**
 * Make authenticated API request
 */
async function apiCall(pathname, options = {}) {
    const config = loadConfig();
    if (!config) {
        console.error('Not configured. Run: node cli/index.js setup');
        process.exit(1);
    }
    
    const url = new URL(pathname, config.url);
    const headers = { 'Content-Type': 'application/json' };
    
    // Add auth token
    if (config.token && config.expires > Date.now()) {
        headers['Authorization'] = `Bearer ${config.token}`;
    } else if (config.password) {
        // Auto-login if no valid token
        const loginRes = await fetch(`${config.url}/api/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ password: config.password })
        });
        const data = await loginRes.json();
        if (data.ok) {
            config.token = data.token;
            config.expires = Date.now() + data.expires_in * 1000;
            saveConfig(config);
            headers['Authorization'] = `Bearer ${data.token}`;
        } else {
            console.error('Login failed');
            process.exit(1);
        }
    }
    
    const res = await fetch(url.toString(), { ...options, headers });
    const text = await res.text();
    
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/**
 * Main CLI dispatcher
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch(command) {
        case 'setup':
            runSetup();
            break;
        case 'auth':
            await handleAuth(args);
            break;
        case 'sub':
            await handleSubscribe(args);
            break;
        case 'nodes':
            await handleNodes();
            break;
        case 'check':
            await handleCheck(args);
            break;
        case 'health':
            await handleHealth();
            break;
        default:
            showHelp();
            break;
    }
}

function runSetup() {
    console.log('=== Initial Setup ===');
    console.log('Please configure your Cloudflare Worker first, then run:');
    console.log('  node cli/index.js setup');
}

async function handleAuth(args) {
    const subcommand = args[0];
    
    if (subcommand === 'login') {
        const password = args.find(a => a.startsWith('--password='))?.split('=')[1];
        if (!password) {
            console.log('Usage: cli.js auth login --password YOUR_PASSWORD [--save]');
            return;
        }
        
        const result = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ password })
        });
        
        if (result.ok) {
            const config = loadConfig() || { url: promptUrl() };
            config.token = result.token;
            config.expires = Date.now() + result.expires_in * 1000;
            if (args.includes('--save')) {
                saveConfig(config);
                console.log('✅ Logged in! Token saved.');
            } else {
                console.log('✅ Logged in!');
                console.log('Token:', result.token);
            }
        } else {
            console.error('❌ Login failed:', result.error);
        }
    } else if (subcommand === 'status') {
        const status = await apiCall('/api/auth/status');
        console.log(status ? '✅ Authenticated' : '❌ Not authenticated');
    }
}

async function handleSubscribe(args) {
    const format = (args.find(a => a.startsWith('--format=')) || '--format=mixed').split('=')[1];
    const result = await apiCall(`/api/sub?type=${format}`);
    
    if (typeof result === 'object') {
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log(result);
    }
}

async function handleNodes() {
    const result = await apiCall('/api/nodes');
    if (Array.isArray(result)) {
        result.forEach(n => console.log(`${n.id.padEnd(15)} ${n.lat.toFixed(4).padStart(8)} ${n.lng.toFixed(4).padStart(8)} ${n.name.padEnd(15)} ${n.country}`));
    } else {
        console.log(result);
    }
}

async function handleCheck(args) {
    const url = args.find(a => a.startsWith('--url='))?.split('=')[1] || 'google.com';
    const result = await apiCall(`/api/check?url=${encodeURIComponent(url)}`);
    
    if (result.latency_ms !== undefined) {
        console.log(`✓ ${url}: ${result.latency_ms}ms (${result.status || result.status_code})`);
    } else {
        console.log(JSON.stringify(result, null, 2));
    }
}

async function handleHealth() {
    const result = await apiCall('/health');
    console.log(`Version: ${result.version || '2.0.0'} | Status: ${result.status || 'ok'}`);
}

function showHelp() {
    console.log(`
cf-workers-sub CLI v2.0.0

Usage: node cli/index.js <command> [options]

Commands:
  setup            Initialize configuration
  auth             Manage authentication
    login          Log in with password
    status         Check current auth status
  sub              Generate subscription
    --format=singbox|clash|mixed|vless
  nodes            List all proxy nodes
  check            Test connectivity
    --url=https://example.com
  health           Check worker health

Examples:
  node cli/index.js auth login --password=xxx --save
  node cli/index.js sub --format singbox
  node cli/index.js check --url=google.com
`);
}

function promptUrl() {
    // For now, just return a placeholder
    return process.env.CF_WORKER_URL || 'https://githubvpn.tepid.de5.net';
}

// Export functions for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { main, loadConfig, saveConfig, apiCall };
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}
