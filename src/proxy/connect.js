/**
 * TCP connection factory using Cloudflare's Edge API
 * Creates outbound TCP connections to target servers.
 */

/**
 * Establish a TCP connection to the target server
 * @param {string} host - Target hostname/IP
 * @param {number} port - Target port (default 443)
 * @returns {Promise<{ readable: ReadableStream, writable: WritableStream }>}
 */
export async function createConnection(host, port = 443) {
    try {
        // Use CF's connect() API for edge TCP connections
        const socket = await connect({
            hostname: host,
            port: port || 443
        });
        
        if (!socket || !socket.writable) {
            throw new Error('Failed to establish TCP connection');
        }
        
        return {
            readable: socket.readable,
            writable: socket.writable
        };
    } catch (error) {
        console.error('[TCP Connect Error]:', error.message);
        throw error;
    }
}
