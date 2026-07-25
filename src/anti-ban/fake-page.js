/**
 * Fake welcome page HTML — serves as a decoy for Cloudflare crawlers
 * This page looks like a normal, innocent website. No proxy indicators.
 */

export const FAKE_PAGE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Personal cloud storage service">
  <meta name="robots" content="index, follow">
  <title>Welcome - Personal Cloud</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 500px;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { opacity: 0.85; line-height: 1.6; }
    .footer { margin-top: 3rem; font-size: 0.8rem; opacity: 0.5; }
  </style>
</head>
<body>
  <div class="container">
    <h1>☁️ Welcome to My Cloud</h1>
    <p>A personal cloud storage and file management service.</p>
    <p style="margin-top: 1rem;">For support, contact: admin@tepid.cc.cd</p>
    <div class="footer">&copy; 2024 Personal Cloud. All rights reserved.</div>
  </div>
</body>
</html>`;
