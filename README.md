# Cloudflare Workers Sub — Proxy & Subscription Server

## Overview

A self-hosted Cloudflare Workers proxy server that provides:
- VLESS WebSocket / gRPC / XHTTP protocol proxy
- Subscription generation (sing-box, Clash, Surge, etc.)
- Best-IP subscription generator
- Admin panel with KV-based configuration
- Proxy health checks
- Login rate limiting

## Quick Start

### 1. Deploy to Cloudflare

```bash
# Install wrangler CLI
npm install -g wrangler

# Initialize project
wrangler init cf-workers-sub --type=webpack --format=typescript

# Copy worker.js into the project
cp worker.js src/worker.ts  # or just src/index.ts

# Configure wrangler.toml
wrangler deploy
```

### 2. Set Environment Variables (required)

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN` | Admin password (login credential) | `my-secret-password` |
| `KEY` | Encryption key for auth tokens | Leave blank for default |
| `UUID` | UUID for version check (auto-generated if not set) | `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` |
| `HOST` | Comma-separated list of hostnames (for multi-host support) | `example.com` |
| `DEBUG` | Enable debug logging (`"1"` or `"true"`) | `1` |
| `KV` | Cloudflare KV namespace binding (for admin config storage) | `{binding="MY_KV"}` |

Add these in the **Cloudflare Dashboard** → Workers → Settings → Variables or via `wrangler.toml`.

### 3. Access Endpoints

| Endpoint | Description |
|----------|-------------|
| `/login` | Admin login page |
| `/admin` | Admin panel (requires authentication) |
| `/sub` | Generate subscription links |
| `/check` | Check proxy health |
| `/version` | Get version info |

## Configuration

All admin settings are stored in **Cloudflare KV** namespace. Bind a KV namespace in your `wrangler.toml`:

```toml
[vars]
ADMIN = "your-admin-password"
KEY = "your-encryption-key"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
```

## Protocols Supported

- VLESS + WebSocket over TLS
- VLESS + gRPC over TLS  
- VLESS + XHTTP over TLS
- SOCKS5 proxy (via check endpoint)
- HTTP/HTTPS proxy (via check endpoint)
- TURN proxy (via check endpoint)
- SSTP proxy (via check endpoint)

## Features

### Rate Limiting
- Login attempts are limited to 5 failures per IP
- Account locked for 30 minutes after max failures

### Multi-Subscription Format Support
- sing-box
- Clash / Clash.Meta (Mihomo)
- Surge
- Quantumult
- Mixed format

### Best IP Subscription Generator
- Automatically probes and ranks IPs
- Generates optimized node lists

### White List for SOCKS5
- Custom domain whitelist in `SOCKS5白名单` array
- Configurable via environment variable `GO2SOCKS5`

## Security Notes

- The proxy uses obfuscated feature strings to avoid detection
- All client communication is encrypted via TLS
- Admin panel requires password authentication
- UUID-based version verification prevents unauthorized access to version API
- **Important**: Change the default ADMIN password immediately after deployment

## File Structure

```
.
├── worker.js          # Main Worker entry point (6284 lines)
├── wrangler.toml      # Cloudflare Workers configuration
├── README.md          # This file
└── package.json       # npm dependencies (if needed)
```

## Troubleshooting

### Connection Issues
- Verify your Cloudflare Workers deployment URL is accessible
- Check that `ADMIN` env var is properly set
- Ensure KV namespace is bound correctly for admin features

### Login Failures
- Check rate limiting log — too many failed attempts may lock your IP
- Verify `KEY` and `ADMIN` values match what you're using

### Subscription Not Working
- Verify the subscription token format: `?token=<MD5(host + userID)>`
- Check UA header includes a browser fingerprint for non-proxy formats

## License

Private / Non-open-source. Developed for standard web application functionalities.

---

Built for reliability and security. Not affiliated with Cloudflare or MEGA.
