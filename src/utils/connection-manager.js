/**
 * Connection manager — tracks active WebSocket connections per IP.
 * Prevents a single IP from opening too many concurrent tunnels.
 */

export class ConnectionManager {
    /**
     * @param {number} maxConcurrentPerIp - Max simultaneous connections per IP (default: 10)
     */
    constructor(maxConcurrentPerIp = 10) {
        this.maxPerIp = maxConcurrentPerIp;
        this.connections = new Map(); // ip -> Set<connectionId>
        this.totalActive = 0;
        this.connectionCounter = 0;
    }

    /**
     * Try to acquire a connection slot for the given IP
     * @param {string} ip
     * @returns {{ ok: boolean, id?: string, error?: string }}
     */
    async acquire(ip) {
        this.connectionCounter++;
        const id = `conn-${this.connectionCounter}`;
        
        if (!this.connections.has(ip)) {
            this.connections.set(ip, new Set());
        }
        
        const ipConnections = this.connections.get(ip);
        
        if (ipConnections.size >= this.maxPerIp) {
            return { ok: false, error: 'Too many concurrent connections' };
        }
        
        ipConnections.add(id);
        this.totalActive++;
        
        return { ok: true, id };
    }

    /**
     * Release a connection slot
     * @param {string} ip
     * @param {string} connId
     */
    async release(ip, connId) {
        const ipConnections = this.connections.get(ip);
        if (ipConnections) {
            ipConnections.delete(connId);
            this.totalActive--;
            if (ipConnections.size === 0) {
                this.connections.delete(ip);
            }
        }
    }

    /**
     * Get current active connection count
     * @returns {number}
     */
    async getActiveCount() {
        return this.totalActive;
    }

    /**
     * Get connections per IP breakdown
     * @returns {Object.<string, number>}
     */
    async getStats() {
        const stats = {};
        for (const [ip, conns] of this.connections.entries()) {
            stats[ip] = conns.size;
        }
        return stats;
    }
}
