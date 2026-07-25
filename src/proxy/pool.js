/**
 * Connection pool — manages reusable connections for multiple proxy sessions
 */

export class ConnectionPool {
    constructor(maxSize = 5) {
        this.maxSize = maxSize;
        this.activeConnections = new Map(); // key -> { stream, timestamp, usageCount }
    }
    
    /**
     * Get or create a connection from the pool
     * @param {string} key - Unique key for the target (host:port)
     * @returns {Promise<object>} { readable, writable }
     */
    async get(key) {
        const existing = this.activeConnections.get(key);
        if (existing && Date.now() - existing.timestamp < 30000) { // 30s TTL
            existing.usageCount++;
            return { readable: existing.readable, writable: existing.writable };
        }
        
        // Create new connection (would use connect() API in production)
        throw new Error('Not implemented: need real TCP connector');
    }
    
    /**
     * Release a connection back to the pool
     */
    async release(key) {
        const conn = this.activeConnections.get(key);
        if (conn) {
            conn.usageCount--;
        }
    }
    
    /**
     * Clear expired connections
     */
    async cleanup() {
        const now = Date.now();
        for (const [key, conn] of this.activeConnections.entries()) {
            if (now - conn.timestamp > 30000 || conn.usageCount <= 0) {
                this.activeConnections.delete(key);
            }
        }
    }
}
