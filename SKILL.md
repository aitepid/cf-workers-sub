---
name: cf-workers-sub
description: "Cloudflare Workers proxy subscription server with VLESS/WSS, trojan, shadowsocks, 3D globe visualization"
version: 2.0.0
author: aitepid
license: MIT
metadata:
  hermes:
    tags: [proxy, cloudflare-workers, subscription, vless]
---

# Cloudflare Workers Proxy Server

Clean-room implementation of a CF Workers proxy subscription server.

## Architecture

```
worker.js          → Routing entry point
├── src/proxy/     → VLESS WS, Trojan, SS protocol handlers
├── src/admin/     → Login, dashboard with 3D globe
├── src/config/    → Config management (env vars)
├── src/utils/     → Crypto, logging, IP geolocation
└── src/subgen/    → Subscription format generators
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PASSWORD` | Yes | - | Admin password |
| `UUID` | No | auto | User UUID for VLESS |
| `HOST` | No | domain | Proxy host header |
| `SUB_PATH` | No | `link` | Subscription path |
| `DISABLE_TROJAN` | No | `false` | Disable Trojan protocol |

## Deployment

1. Commit to GitHub
2. Cloudflare Workers auto-deploys from repo
3. Set env vars in CF Dashboard
