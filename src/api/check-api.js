/**
 * Check API endpoint (/api/check) — Connectivity test for remote hosts
 */

export async function handleCheckApi(pathname) {
    try {
        const url = new URL(pathname, 'http://localhost');
        const targetUrl = url.searchParams.get('url') || 'google.com';
        
        if (!targetUrl.startsWith('http')) {
            // Default to HTTPS
            url.protocol = 'https:';
            url.host = targetUrl;
        } else {
            url.hostname = targetUrl;
        }
        
        const startTime = Date.now();
        let response;
        
        try {
            response = await fetch(url.toString(), {
                method: 'GET',
                redirect: 'follow',
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });
        } catch (err) {
            return new Response(JSON.stringify({
                url: targetUrl,
                latency_ms: Date.now() - startTime,
                status: 'error',
                error: err.message
            }), { headers: { 'Content-Type': 'application/json' } });
        }
        
        return new Response(JSON.stringify({
            url: targetUrl,
            status_code: response.status,
            latency_ms: Date.now() - startTime,
            final_url: response.url
        }), { headers: { 'Content-Type': 'application/json' } });
        
    } catch (error) {
        return new Response(JSON.stringify({
            url: 'unknown',
            status: 'error',
            error: error.message
        }), { headers: { 'Content-Type': 'application/json' } });
    }
}
