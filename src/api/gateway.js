/**
 * RESTful API Gateway — central router for all /api/* endpoints
 * Handles authentication, rate limiting, and request dispatching.
 */

import { verifyToken } from '../auth/jwt.js';

const API_PREFIX = '/api/';

/**
 * Main API gateway handler
 * @param {string} pathname - Request path (e.g., '/api/auth/login')
 * @param {Request} request - Incoming HTTP request
 * @param {object} env - Cloudflare Worker environment variables
 * @param {object} config - Merged configuration object
 * @returns {Response} API response
 */
export async function apiGateway(pathname, request, env, config) {
    // Extract auth token
    const authHeader = request.headers.get('Authorization');
    const cookie = request.headers.get('Cookie') || '';
    const token = extractToken(authHeader, cookie);
    
    // Public routes (no auth required)
    if (pathname === '/api/auth/login' && request.method === 'POST') {
        return handleAuthLogin(request, env, config);
    }
    
    if (pathname === '/api/auth/status') {
        return { status: token ? 200 : 401, body: { authenticated: !!token } };
    }
    
    if (pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', version: '2.0.0' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // All other /api/* routes require auth
    if (!token) {
        return unauthorizedResponse();
    }
    
    const tokenCheck = verifyToken(token, env.PASSWORD);
    if (!tokenCheck.valid) {
        return unauthorizedResponse();
    }
    
    // Route to appropriate handler
    if (pathname.startsWith('/api/sub')) {
        return handleSubApi(pathname, config, tokenCheck.payload);
    }
    
    if (pathname === '/api/config') {
        return request.method === 'GET' 
            ? handleGetConfig(config) 
            : handlePutConfig(request, config);
    }
    
    if (pathname === '/api/nodes') {
        return handleNodesApi();
    }
    
    if (pathname.startsWith('/api/check')) {
        return handleCheckApi(pathname);
    }
    
    if (pathname === '/api/stats') {
        return handleStatsApi();
    }
    
    return notFoundResponse();
}

function extractToken(authHeader, cookie) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    // Try cookie
    const cookieMatch = cookie.match(/session=([^;]+)/);
    if (cookieMatch) {
        return cookieMatch[1];
    }
    return null;
}

function unauthorizedResponse() {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
    });
}

function notFoundResponse() {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
    });
}
