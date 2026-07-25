/**
 * Config API endpoints (/api/config)
 */

/**
 * GET /api/config — Returns current configuration (sans secrets)
 */
export function handleGetConfig(config) {
    return new Response(JSON.stringify({
        uuid: config.uuid,
        host: config.host,
        port: config.port,
        protocols: config.protocols,
        subPath: config.subPath,
        maxConnectionsPerIp: config.maxConnectionsPerIp,
        rateLimitPerMinute: config.rateLimitPerMinute
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * PUT /api/config — Update configuration (limited set of fields)
 */
export async function handlePutConfig(request, config) {
    try {
        const body = await request.json();
        
        // Merge changes into config
        for (const key in body) {
            if (['maxConnectionsPerIp', 'rateLimitPerMinute'].includes(key)) {
                config[key] = parseInt(body[key], 10);
            } else {
                config[key] = body[key];
            }
        }
        
        return new Response(JSON.stringify({ success: true, config }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Bad request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
