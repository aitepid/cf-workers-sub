/**
 * WebSocket upgrade handler
 * Transitions HTTP request to a WebSocket tunnel connection.
 */

/**
 * Handle the WebSocket upgrade for proxy connections
 * @param {Request} request - The incoming HTTP request with Upgrade: websocket header
 * @param {object} config - Loaded configuration object
 * @returns {Response} 101 Switching Protocols response
 */
export async function handleUpgrade(request, config) {
    const url = new URL(request.url);
    
    // Extract resource from path
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
        return new Response('Bad Request', { status: 400 });
    }
    
    const clientId = pathParts[0];
    
    // Validate UUID against configured UUID
    if (!clientId || clientId !== config.uuid) {
        return new Response('Forbidden', { status: 403 });
    }
    
    // Verify WebSocket upgrade
    const upgradeHeader = request.headers.get('upgrade')?.toLowerCase();
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Expected websocket upgrade', { status: 400 });
    }
    
    // Get target host/path from query parameters
    const targetHost = url.searchParams.get('host') || config.host || url.hostname;
    const targetPort = parseInt(url.searchParams.get('port')) || 443;
    const transportPath = url.searchParams.get('path') || '/' + clientId;
    
    try {
        // Create WebSocket pair
        const { 0: serverSocket, 1: clientSocket } = new WebSocketPair();
        clientSocket.accept();
        
        // Set up streaming pipes
        const [clientReadable, clientWritable] = clientSocket.pipeThrough(new TransformStream());
        const [serverReadable, serverWritable] = serverSocket.pipeThrough(new TransformStream());
        
        // Forward data both ways
        const pumpA = clientReadable.pipeTo(serverWritable);
        const pumpB = serverReadable.pipeTo(clientWritable);
        
        // Wait for either direction to complete
        await Promise.race([pumpA.catch(() => {}), pumpB.catch(() => {})]);
        
        return new Response(null, {
            status: 101,
            webSocket: serverSocket
        });
        
    } catch (error) {
        console.error('[Proxy Upgrade Error]:', error.message);
        return new Response('Internal Server Error', { status: 500 });
    }
}
