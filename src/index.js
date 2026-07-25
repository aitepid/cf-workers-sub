/**
 * Barrel export — 统一导出所有公共模块
 * _worker.js 只需 import * from './src/index.js' 就能获取全部功能
 */

// Config
export { DEFAULT_CONFIG } from './config/defaults.js';
export { loadConfig } from './config/load.js';

// Crypto
export { md5 } from './crypto/md5.js';
export { encode: base64Encode, decode: base64Decode } from './crypto/base64url.js';

// Anti-ban
export { FAKE_PAGE_HTML } from './anti-ban/fake-page.js';
export { isBot } from './anti-ban/bot-detect.js';
export { handleRootGet } from './anti-ban/root-handler.js';
export { handleLoginGet } from './anti-ban/login-guard.js';

// Auth
export { generateToken } from './auth/jwt.js';
export { verifyToken } from './auth/jwt.js';
export { setCookie, clearCookie } from './auth/cookie.js';
export { validatePassword } from './auth/validate.js';
export { LOGIN_PAGE_HTML } from './auth/page.js';

// Proxy
export { parseVlessRequest } from './proxy/vless.js';
export { parseTrojanRequest } from './proxy/trojan.js';
export { handleUpgrade } from './proxy/upgrade.js';
export { createConnection } from './proxy/connect.js';
export { pipeStreams } from './proxy/tunnel.js';
export { ConnectionPool } from './proxy/pool.js';

// Subgen
export { parseParams } from './subgen/parser.js';
export { generateLinks } from './subgen/links.js';
export { formatAsClash } from './subgen/clash.js';
export { formatAsSingBox } from './subgen/singbox.js';
export { formatAsMixed } from './subgen/mixed.js';

// API
export { apiGateway } from './api/gateway.js';
export { handleNodesApi } from './nodes-api.js';
export { handleCheckApi } from './check-api.js';

// Utils
export { logger } from './utils/log.js';
export { randomUUID, randomIP, randomString } from './utils/random.js';
export { RateLimiter } from './utils/rate-limit.js';
export { ConnectionManager } from './utils/connection-manager.js';

// Admin
export { ADMIN_DASHBOARD_HTML, ADMIN_CSS, ADMIN_JS } from './admin/dashboard.js';
