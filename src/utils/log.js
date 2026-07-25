/**
 * Structured logger with timestamps
 * Usage: logger.info('msg'), logger.error('msg'), logger.debug('msg')
 */

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

export const logger = {
    /**
     * Log an info message with timestamp
     * @param {string} msg - Message to log
     */
    info(msg) {
        console.log(`[INFO] ${new Date().toISOString()} ${msg}`);
    },
    
    /**
     * Log a warning message
     * @param {string} msg
     */
    warn(msg) {
        console.warn(`[WARN] ${new Date().toISOString()} ${msg}`);
    },
    
    /**
     * Log an error message
     * @param {string} msg
     */
    error(msg) {
        console.error(`[ERROR] ${new Date().toISOString()} ${msg}`);
    },
    
    /**
     * Log a debug message (only in DEBUG mode)
     * @param {string} msg
     */
    debug(msg) {
        if (process.env.DEBUG === '1') {
            console.log(`[DEBUG] ${new Date().toISOString()} ${msg}`);
        }
    }
};
