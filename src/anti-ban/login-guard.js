/**
 * Login guard — protects the /login route
 * GET /login → returns empty hint page (not full login form)
 * POST /login → triggers password validation via auth/validate.js
 */
import { FAKE_PAGE_HTML } from './fake-page.js';

const EMPTY_HINT_HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Please Use API</title></head>
<body style="font-family:sans-serif;text-align:center;margin-top:20vh">
  <p style="color:#666">Please use the API or CLI to authenticate.</p>
</body></html>`;

/**
 * Handle GET /login
 * @returns {Response} Empty hint page
 */
export function handleLoginGet() {
    return new Response(EMPTY_HINT_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
