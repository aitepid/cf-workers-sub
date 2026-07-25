/**
 * Login page HTML form — shown when user navigates to /admin via browser
 */

export const LOGIN_PAGE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#f0f2f5;display:flex;justify-content:center;align-items:center;min-height:100vh}.box{background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1);width:100%;max-width:400px;text-align:center}h2{margin-bottom:30px;color:#333}input{width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:16px}button{width:100%;padding:12px;background:#1a73e8;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}#msg{margin-top:12px;font-size:14px}</style></head>
<body><div class="box"><h2>🔐 Admin Login</h2>
<form id="f"><input type="password" id="p" placeholder="Password" required>
<button type="submit">Login</button></form><div id="msg"></div></div>
<script>document.getElementById('f').onsubmit=async e=>{e.preventDefault();const m=document.getElementById('msg');try{const r=await fetch('/login',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'password='+encodeURIComponent(document.getElementById('p').value)}),d=await r.json();m.textContent=d.success?'OK!':d.error,m.style.color=d.success?'green':'red',d.success&&setTimeout(()=>location.href='/admin',500)}catch(err){m.textContent=err.message,m.style.color='red'}}</script></body></html>`;
