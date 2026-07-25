# Cloudflare Workers Proxy Server v2.0

## 🛡️ 防封禁设计

- `/` 永远返回正常欢迎页面（欺骗 Cloudflare Crawler）
- Bot UA 检测（Googlebot / BingBot → 只返回假页面）
- 代理入口隐藏于 `/api/*` + WebSocket tunnel
- 登录入口 `/login` 需 POST 才能触发认证

## 📦 模块化架构

```
_worker.js          ← 入口文件（路由分发 ~120行）
├── src/config/     ← 配置加载
├── src/crypto/     ← MD5/Base64
├── src/anti-ban/   ← 防封禁
├── src/auth/       ← JWT 认证
├── src/proxy/      ← VLESS/Trojan 代理
├── src/subgen/     ← 订阅生成
├── src/api/        ← RESTful API
├── src/admin/      ← Dashboard 管理面板
└── src/utils/      ← Logger/RateLimiter
```

## 🚀 部署

### 1. 克隆仓库到 GitHub

```bash
git remote add origin https://github.com/aitepid/cf-workers-sub.git
git push -u origin main
```

### 2. Cloudflare Workers 绑定仓库

1. Dashboard → Workers & Pages → New Application
2. Connect to GitHub → 选 `cf-workers-sub` 仓库
3. Build command: 留空
4. Deploy command: 留空（CF 自动处理 JS）
5. 添加环境变量 `PASSWORD`、`UUID`、`HOST`

### 3. 绑定自定义域名

在 Cloudflare DNS 将 `githubvpn.tepid.de5.net` 指向 Worker。

## 🔌 API 端点

| 方法 | 路径 | 功能 |
|------|------|------|
| POST | `/api/auth/login` | 登录获取 token |
| GET | `/api/nodes` | 节点列表 |
| GET | `/api/sub?type=singbox` | Sing-box 订阅 |
| GET | `/api/check?url=x.com` | 连通性测试 |
| GET | `/health` | 健康检查（公开） |

## 💻 CLI 工具

```bash
node cli/index.js auth login --password xxx --save
node cli/index.js sub --format singbox
node cli/index.js check --url google.com
node cli/index.js nodes
```
