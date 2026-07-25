/**
 * Root path handler — always returns the fake welcome page
 * This is the primary anti-ban defense: / should NEVER expose proxy functionality.
 */
import { FAKE_PAGE_HTML } from './fake-page.js';

/**
 * Handle GET / requests
 * @returns {Response} Always the fake welcome page HTML
 */
export function handleRootGet() {
    return new Response(FAKE_PAGE_HTML, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}
