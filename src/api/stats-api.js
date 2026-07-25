/**
 * Stats API endpoint (/api/stats) — Runtime statistics
 */
import { createHash } from 'crypto';

export async function handleStatsApi() {
    const startTime = Date.now();
    const uptimeSeconds = Math.floor((startTime - (globalThis._startTime || startTime)) / 1000);
    
    // Generate a pseudo-request ID based on timestamp + random
    const requestId = createHash('md5').update(String(Date.now())).digest('hex');
    
    return new Response(JSON.stringify({
        version: '2.0.0',
        request_id: requestId,
        uptime_seconds: uptimeSeconds,
        node_count: 8,
        active_subscriptions: 0,
        status: 'healthy'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
