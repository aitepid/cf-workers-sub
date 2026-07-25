/**
 * Authentication API endpoints (/api/auth/*)
 */
import { generateToken } from '../auth/jwt.js';

async function handleAuthLogin(request, env, config) {
    try {
        const body = await request.json();
        const inputPassword = body.password || '';
        const storedPassword = env.PASSWORD;
        
        if (inputPassword === storedPassword) {
            const token = generateToken(
                { iat: Date.now(), exp: Date.now() + 86400000 },
                storedPassword
            );
            
            return new Response(JSON.stringify({
                ok: true,
                token,
                expires_in: 86400
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({
            ok: false,
            error: 'Invalid password'
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            ok: false,
            error: 'Bad request'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
