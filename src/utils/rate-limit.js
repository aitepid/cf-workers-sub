/**
 * Rate limiter — prevents abuse by limiting requests per IP per time window.
 */

export class RateLimiter {
    /**
     * @param {number} maxRequestsPerMinute - Max requests allowed per minute per IP (default: 60)
     */
    constructor(maxRequestsPerMinute = 60) {
        this.maxRequests = maxRequestsPerMinute;
        this.windowMs = 60 * 1000; // 1 minute
        this.requests = new Map(); // ip -> [timestamps]
        
        // Clean up old entries every minute
        setInterval(() => {
            const now = Date.now();
            for (const [ip, timestamps] of this.requests.entries()) {
                while (timestamps.length > 0 && now - timestamps[0] > this.windowMs) {
                    timestamps.shift();
                }
                if (timestamps.length === 0) {
                    this.requests.delete(ip);
                }
            }
        }, this.windowMs).unref?.(); // .unref() to prevent blocking process exit
    }

    /**
     * Check if a request from the given IP is allowed
     * @param {string} ip - Client IP address
     * @returns {{ allowed: boolean, remaining: number }}
     */
    async isAllowed(ip) {
        const now = Date.now();
        
        // Initialize or get existing timestamps for this IP
        if (!this.requests.has(ip)) {
            this.requests.set(ip, []);
        }
        
        const timestamps = this.requests.get(ip);
        
        // Remove timestamps outside the current window
        while (timestamps.length > 0 && now - timestamps[0] > this.windowMs) {
            timestamps.shift();
        }
        
        if (timestamps.length >= this.maxRequests) {
            return { allowed: false, remaining: 0 };
        }
        
        timestamps.push(now);
        const remaining = this.maxRequests - timestamps.length;
        
        return { allowed: true, remaining };
    }
}
