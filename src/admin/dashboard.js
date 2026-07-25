/**
 * Admin Dashboard HTML — includes Globe visualization + node list
 */

export const ADMIN_DASHBOARD_HTML = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard - cf-workers-sub</title>
<link rel="stylesheet" href="/admin.css">
<script src="https://unpkg.com/globe.gl@2.32.2/dist/globe.gl.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
</head>
<body>
<div id="header"><h1>🌍 Proxy Dashboard</h1><button onclick="logout()">Logout</button></div>
<div id="globe-container"></div>
<div id="node-panel">
<h3>Nodes</h3>
<ul id="node-list"></ul>
</div>
<div id="modal-overlay" class="hidden">
<div class="modal">
<button onclick="closeModal()">&times;</button>
<h3 id="modal-title"></h3>
<div id="modal-body"></div>
</div>
</div>
<script src="/admin.js"></script>
</body></html>`;

// Embedded admin.css string (served as /admin.css)
export const ADMIN_CSS = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0a0e27;color:#fff;height:100vh}#header{background:rgba(0,0,0,.5);padding:12px 24px;display:flex;justify-content:space-between;align-items:center}.logout-btn{background:#dc3545;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer}#globe-container{width:100vw;height:calc(100vh - 50px)}#node-panel{position:absolute;top:60px;left:20px;background:rgba(0,0,0,.6);backdrop-filter:blur(10px);border-radius:12px;padding:16px;width:280px;max-height:calc(100vh - 80px);overflow-y:auto}.node-item{padding:8px;margin:4px 0;background:rgba(255,255,255,.1);border-radius:8px;cursor:pointer;font-size:13px}.node-item:hover{background:rgba(100,150,255,.4)}.modal-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.8);z-index:100;justify-content:center;align-items:center}.modal-overlay.show{display:flex}.modal{background:#1b1f3a;border-radius:16px;padding:24px;max-width:400px;width:90%}.close-btn{float:right;background:none;border:none;color:#fff;font-size:24px;cursor:pointer}`;

// Embedded admin.js string (includes globe rendering + modal logic)
export const ADMIN_JS = `let nodes=[];let activeToken='';function init(){const hash=location.hash.substring(1);if(hash)activeToken=decodeURIComponent(hash.split('=')[1]||'');fetchNodes();}function fetchNodes(){fetch('/api/nodes',{headers:activeToken?{'Authorization':'Bearer '+activeToken}:{} }).then(r=>r.json()).then(n=>{nodes=n;updateStats();renderGlobe();renderList();}).catch(e=>console.error('Fetch nodes failed:',e));}function updateStats(){document.getElementById('node-list').innerHTML='<p>'+nodes.length+' nodes online</p>';}function renderGlobe(){const el=document.getElementById('globe-container');if(!el)return;Globe().globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg').backgroundColor('rgba(0,0,0,0)').dotSize(0.3).pointsData(nodes).pointLat(d=>d.lat).pointLng(d=>d.lng).pointColor(()=>'#8be9fd').pointAltitude(0.01).pointRadius(0.5).onPointClick(p=>showModal(p)).controls().autoRotate=true;}function renderList(){document.getElementById('node-list').innerHTML=nodes.slice(0,8).map(n=>'<div class="node-item" onclick="showModal('+JSON.stringify(n).replace(/"/g,'\\\\\\"')+')">'+n.name+' <span style="float:right">'+n.country+'</span></div>').join('');}function showModal(node){document.getElementById('modal-title').textContent=node.name+' '+node.country;document.getElementById('modal-body').innerHTML='<div id="qr"></div><p>VLESS: <code>vless://NODE_UUID@githubvpn.tepid.de5.net:443?security=tls&type=ws#'+node.name+'</code></p>';new QRCode(document.getElementById('qr'),{text:'vless://NODE_UUID@githubvpn.tepid.de5.net:443?security=tls&type=ws#'+node.name,width:180,height:180});document.getElementById('modal-overlay').classList.add('show');}function closeModal(){document.getElementById('modal-overlay').classList.remove('show');}function logout(){location.href='/logout';}window.onload=init;`;
