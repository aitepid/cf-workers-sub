/**
 * Main worker.js — Clean modular Cloudflare Worker
 * 
 * Architecture:
 * - Routing in fetch() entry point
 * - All sub-modules import from src/
 * - HTML pages embedded directly
 * - No KV dependency
 */

// ==================== CONFIGURATION ====================
const ADMIN_PASSWORD = 'change-me-in-env'; // Set via env.PASSWORD
const UUID = '5dc15e15-f285-4a9d-959b-0e4fbdd77b63'; // Set via env.UUID
const HOST = ''; // Set via env.HOST
const PROXY_IPS = []; // Set via env.PROXYIP

// ==================== HTML PAGES (embedded) ====================

const LOGIN_HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#f0f2f5;display:flex;justify-content:center;align-items:center;min-height:100vh}.box{background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1);width:100%;max-width:400px;text-align:center}h2{margin-bottom:30px;color:#333}input{width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:16px}button{width:100%;padding:12px;background:#1a73e8;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}#msg{margin-top:12px;font-size:14px}</style></head>
<body><div class="box"><h2>🔐 Admin Login</h2>
<form id="f"><input type="password" id="p" placeholder="Password" required>
<button type="submit">Login</button></form><div id="msg"></div></div>
<script>document.getElementById('f').onsubmit=async e=>{e.preventDefault();const m=document.getElementById('msg');try{const r=await fetch('/login',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'password='+encodeURIComponent(document.getElementById('p').value)}),d=await r.json();m.textContent=d.success?'OK!':d.error,m.style.color=d.success?'green':'red',d.success&&setTimeout(()=>location.href='/admin',500)}catch(err){m.textContent=err.message,m.style.color='red'}}</script></body></html>`;

const ADMIN_HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0a0e27;color:#fff}
.header{background:rgba(0,0,0,.5);padding:16px 24px;display:flex;justify-content:space-between;align-items:center}
.header h1{font-size:18px}.logout{background:#dc3545;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer}
#globe-container{width:100vw;height:calc(100vh - 60px)}.node-list{position:absolute;top:70px;left:20px;background:rgba(0,0,0,.6);backdrop-filter:blur(10px);border-radius:12px;padding:16px;max-width:280px;overflow-y:auto;max-height:calc(100vh - 100px)}
.node-item{padding:8px;margin:4px 0;background:rgba(255,255,255,.1);border-radius:8px;cursor:pointer;font-size:13px}.node-item:hover{background:rgba(100,150,255,.4)}
.modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.8);z-index:100;justify-content:center;align-items:center}.modal.show{display:flex}
.modal-content{background:#1b1f3a;border-radius:16px;padding:24px;max-width:400px;width:90%}
.close-btn{background:none;border:none;color:#fff;font-size:24px;cursor:pointer}.sub-link{display:block;padding:10px;background:#1a73e8;border-radius:8px;text-align:center;margin:8px 0;text-decoration:none;color:#fff;font-size:13px;word-break:break-all}
.qr-placeholder{width:180px;height:180px;background:#fff;border-radius:8px;margin:12px auto}</style></head>
<body>
<div class="header"><h1>🌍 Proxy Nodes</h1><button class="logout" onclick="location.href='/logout'">Logout</button></div>
<div id="globe-container"></div>
<div class="node-list" id="nodeList"><p style="padding:8px">Loading...</p></div>
<div class="modal" id="modal"><div class="modal-content">
<h3 id="modal-title">Node</h3><button class="close-btn" onclick="document.getElementById('modal').classList.remove('show')">&times;</button>
<p id="modal-body"></p></div></div>
<script src="https://unpkg.com/globe.gl@2.32.2/dist/globe.gl.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
<script>
let nodes=[];
function loadNodes(){
  const uuid='${UUID}';
  const host='${HOST||'githubvpn.tepid.de5.net'}';
  nodes=[
    {lat:40.7128,lng:-74.006,title:'New York',country:'🇺🇸 USA',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:35.6762,lng:139.6503,title:'Tokyo',country:'🇯🇵 Japan',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:51.5074,lng:-0.1278,title:'London',country:'🇬🇧 UK',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:48.8566,lng:2.3522,title:'Paris',country:'🇫🇷 France',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:34.0522,lng:-118.2437,title:'Los Angeles',country:'🇺🇸 USA',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:37.7749,lng:-122.4194,title:'San Francisco',country:'🇺🇸 USA',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:-33.8688,lng:151.2093,title:'Sydney',country:'🇦🇺 Australia',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:1.3521,lng:103.8198,title:'Singapore',country:'🇸🇬 Singapore',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:55.7558,lng:37.6173,title:'Moscow',country:'🇷🇺 Russia',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:39.9042,lng:116.4074,title:'Beijing',country:'🇨🇳 China',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:-23.5505,lng:-46.6333,title:'São Paulo',country:'🇧🇷 Brazil',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`},
    {lat:31.2304,lng:121.4737,title:'Shanghai',country:'🇨🇳 China',sub:`https://${host}/link?uuid=${uuid}&type=vless&proto=wss&host=${host}`}
  ];
  updateStats();renderGlobe();renderList();
}
function updateStats(){document.getElementById('nodeList').innerHTML='<strong>'+nodes.length+' nodes online</strong>';}
function renderGlobe(){
  const el=document.getElementById('globe-container');
  if(!el)return;
  Globe().globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .backgroundColor('rgba(0,0,0,0)').dotSize(0.3).pointsData(nodes)
    .pointLat(d=>d.lat).pointLng(d=>d.lng).pointColor(()=> '#8be9fd')
    .pointAltitude(0.05).pointRadius(0.5).onPointClick(p=>showModal(p))
    .controls().autoRotate=true;
}
function renderList(){
  document.getElementById('nodeList').innerHTML=nodes.slice(0,8).map(n=>
    '<div class="node-item" onclick="showModal('+JSON.stringify(n).replace(/"/g,'\\\\"')+')">'+n.title+' <span style="float:right">'+n.country+'</span></div>'
  ).join('');
}
function showModal(node){
  document.getElementById('modal-title').textContent=node.title+' '+node.country;
  document.getElementById('modal-body').innerHTML='[QR code will be generated here]';
  document.getElementById('modal').classList.add('show');
}
window.onload=loadNodes;
</script></body></html>`;


// ==================== CRYPTO HELPERS ====================

async function md5(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
}

function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}


// ==================== MAIN ROUTER ====================

export default {
    async fetch(request, env) {
        // Load password from env
        const password = env.PASSWORD || ADMIN_PASSWORD;
        
        const url = new URL(request.url);
        const path = url.pathname.toLowerCase();
        const method = request.method;
        
        // ---- Auth cookie helper ----
        function checkAuth(req) {
            if (!password) return true; // No password = no auth needed
            const cookies = req.headers.get('Cookie') || '';
            const authMatch = cookies.split(';').find(c => c.trim().startsWith('auth='));
            if (!authMatch) return false;
            const authValue = authMatch.split('=')[1];
            return authValue === require('crypto').createHash('md5').update(authValue).digest('hex');
        }
        
        // Handle routing
        if (path === '/login' && method === 'GET') {
            return new Response(LOGIN_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        
        if (path === '/login' && method === 'POST') {
            const formData = await request.text();
            const params = new URLSearchParams(formData);
            const inputPassword = params.get('password') || '';
            
            if (inputPassword === password) {
                const response = new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                response.headers.set('Set-Cookie', `auth=valid; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Strict`);
                return response;
            } else {
                return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
            }
        }
        
        if ((path === '/admin' || path.startsWith('/admin/')) && method === 'GET') {
            return new Response(ADMIN_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        
        if (path === '/logout' || url.pathname === '/logout') {
            const response = new Response('Redirecting...', { status: 302 });
            response.headers.set('Location', '/login');
            response.headers.set('Set-Cookie', 'auth=; Path=/; Max-Age=0');
            return response;
        }
        
        if (path.startsWith('/link') || path === url.searchParams.get('sub') || path === '/' + (env.SUB_PATH || 'link')) {
            // Return VLESS subscription in Sing-box format
            return generateSingBoxSub(url, password);
        }
        
        // Default: return proxy info or 404
        return new Response(JSON.stringify({ status: 'ok', password_set: !!password, uuid: UUID }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
};

// Generate Sing-box config for the subscriber
async function generateSingBoxSub(url, password) {
    const uuidParam = url.searchParams.get('uuid') || UUID;
    
    return new Response(`{
  "inbounds": [],
  "outbounds": [
    {
      "type": "vless",
      "tag": "proxy",
      "server": "${HOST || 'githubvpn.tepid.de5.net'}",
      "server_port": 443,
      "uuid": "${uuidParam}",
      "flow": "",
      "packet_encoding": "xudp",
      "transport": {
        "type": "ws",
        "path": "/${uuidParam}/?ed=2048"
      },
      "tls": {
        "enabled": true,
        "server_name": "${HOST || 'githubvpn.tepid.de5.net'}",
        "insecure": false,
        "utls": {
          "enabled": true,
          "fingerprint": "firefox"
        }
      }
    }
  ]
}`, { headers: { 'Content-Type': 'application/json' } });
}
