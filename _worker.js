/**
 * _worker.js — Cloudflare Workers 唯一入口文件
 * 所有路由分发、请求处理的核心控制器。
 */

import { loadConfig } from './src/config/load.js';
import { handleRootGet } from './src/anti-ban/root-handler.js';
import { isBot } from './src/anti-ban/bot-detect.js';
import { handleLoginGet } from './src/anti-ban/login-guard.js';
import { validatePassword } from './src/auth/validate.js';
import { generateToken } from './src/auth/jwt.js';
import { setCookie } from './src/auth/cookie.js';
import { LOGIN_PAGE_HTML } from './src/auth/page.js';
import { apiGateway } from './src/api/gateway.js';
import { handleUpgrade } from './src/proxy/upgrade.js';
import { ADMIN_DASHBOARD_HTML, ADMIN_CSS, ADMIN_JS } from './src/admin/dashboard.js';

// Track start time for uptime calculation
globalThis._startTime = Date.now();

export default {
    async fetch(request, env) {
        const config = loadConfig(env);
        const url = new URL(request.url);
        const path = url.pathname.toLowerCase();
        const method = request.method;
        
        // Get client IP from headers (for rate limiting & logging)
        const forwardedFor = request.headers.get('X-Forwarded-For') || '0.0.0.0';
        const userAgent = request.headers.get('User-Agent');
        
        // Bot detection: if Googlebot/CloudflareBot hits us, always show fake page
        if (isBot(userAgent)) {
            return new Response('<html><body><h1>Welcome to My Cloud</h1></body></html>', {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        try {
            // ==================== STATIC ROUTING ====================
            
            // / → Fake welcome page (anti-ban)
            if (path === '/' || path === '') {
                return handleRootGet();
            }
            
            // /login GET → Empty hint page
            if (path === '/login' && method === 'GET') {
                return handleLoginGet();
            }
            
            // /login POST → Auth validation
            if (path === '/login' && method === 'POST') {
                const formData = await request.text();
                const params = new URLSearchParams(formData);
                const inputPassword = params.get('password') || '';
                
                // Validate password using auth module
                const result = validatePassword(inputPassword, env.PASSWORD);
                
                if (result.valid) {
                    const token = generateToken(
                        { iat: Date.now(), exp: Date.now() + 86400000 },
                        env.PASSWORD
                    );
                    
                    const cookieHeaders = setCookie(token, {
                        name: 'session',
                        maxAge: 86400,
                        path: '/'
                    });
                    
                    return new Response(JSON.stringify({ success: true }), {
                        status: 200,
                        headers: { 
                            'Content-Type': 'application/json',
                            'Set-Cookie': cookieHeaders.join('; ')
                        }
                    });
                }
                
                return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // /admin → Dashboard page
            if (path === '/admin' && method === 'GET') {
                return new Response(ADMIN_DASHBOARD_HTML, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                });
            }
            
            // /admin.css → Embedded CSS
            if (path === '/admin.css' && method === 'GET') {
                return new Response(ADMIN_CSS, {
                    headers: { 'Content-Type': 'text/css; charset=utf-8' }
                });
            }
            
            // /admin.js → Embedded JS
            if (path === '/admin.js' && method === 'GET') {
                return new Response(ADMIN_JS, {
                    headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
                });
            }
            
            // /logout → Clear session
            if (path === '/logout' && method === 'GET') {
                return new Response('Redirecting...', {
                    status: 302,
                    headers: { 
                        'Location': '/',
                        'Set-Cookie': 'session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
                    }
                });
            }
            
            // /health → Public health check
            if (path === '/health' && method === 'GET') {
                return new Response(JSON.stringify({ status: 'ok', version: '2.0.0' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // ==================== API ROUTING ====================
            
            if (path.startsWith('/api/')) {
                return apiGateway(path, request, env, config);
            }
            
            // ==================== PROXY TUNNEL ====================
            
            // Match proxy pattern: /{uuid}/?ed=xxx or /link?token=...
            const pathParts = url.pathname.split('/').filter(Boolean);
            
            if (pathParts.length > 0) {
                const resource = pathParts[0];
                
                // Check if it looks like a proxy subscription request (no upgrade header = not WS)
                if (!request.headers.get('upgrade')?.toLowerCase()) {
                    // This might be a subscription request
                    if (url.searchParams.has('sub') || path === `/${config.subPath}`) {
                        // Format subscription based on query params
                        const format = url.searchParams.get('format') || 'mixed';
                        let content = '';
                        let contentType = 'text/plain';
                        
                        switch(format) {
                            case 'singbox':
                                content = JSON.stringify(buildSingBox(config), null, 2);
                                contentType = 'application/json';
                                break;
                            case 'clash':
                                content = buildClashYAML(config);
                                contentType = 'text/yaml';
                                break;
                            case 'vless':
                                content = `vless://${config.uuid}@${config.host}:443?security=tls&type=ws#${encodeURI('default')}`;
                                break;
                            default:
                                content = buildMixedText(config);
                        }
                        
                        return new Response(content, {
                            headers: { 'Content-Type': contentType }
                        });
                    }
                }
                
                // Proxy WebSocket upgrade request
                if (request.headers.get('upgrade')?.toLowerCase() === 'websocket') {
                    return await handleUpgrade(request, config);
                }
            }
            
            // ==================== DEFAULT FALLBACK ====================
            
            return new Response('Hello World', { status: 200 });
            
        } catch (error) {
            console.error('[Worker Error]:', error.message);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
};

// ==================== HELPER FUNCTIONS ====================

function buildSingBox(config) {
    return {
        inbounds: [],
        outbounds: [
            {
                type: "vless",
                tag: "proxy",
                server: config.host || 'githubvpn.tepid.de5.net',
                server_port: 443,
                uuid: config.uuid,
                tls: { enabled: true, server_name: config.host },
                transport: {
                    type: "ws",
                    path: `/${config.uuid}/?ed=2048`,
                    headers: { Host: config.host }
                }
            },
            { type: "direct", tag: "direct" }
        ],
        route: { final: "proxy" },
        experimental: { cache_file: { enabled: true } }
    };
}

function buildClashYAML(config) {
    const host = config.host || 'githubvpn.tepid.de5.net';
    return `proxies:
  - name: "Default"
    type: vless
    server: ${host}
    port: 443
    uuid: ${config.uuid}
    network: ws
    tls: true
    servername: ${host}
    ws-opts:
      path: /${config.uuid}/?ed=2048
      headers:
        Host: ${host}`;
}

function buildMixedText(config) {
    return `vless://${config.uuid}@${config.host}:443?security=tls&type=ws&encryption=none#${encodeURI(config.host)}`;
}
