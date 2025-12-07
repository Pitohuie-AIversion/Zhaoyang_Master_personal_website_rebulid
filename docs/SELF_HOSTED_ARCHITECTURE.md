# 自建网站项目架构与实施方案 (Self-Hosted Website Architecture)

本文档详细描述了将当前个人学术网站项目从 Vercel 迁移/部署到自建 VPS 环境的完整实施方案，涵盖基础架构、核心功能、测试体系及监控维护。

## 1. 网站基础架构搭建 (Infrastructure)

### 1.1 域名与 DNS
- **域名注册**: 建议在 Namecheap / GoDaddy / Aliyun 购买域名 (e.g., `zhaoyang-mou.com`).
- **DNS 解析**: 推荐使用 Cloudflare 进行 DNS 解析，享受免费的 CDN 加速和基础 DDoS 防护。
  - A 记录: `@` -> VPS IP
  - CNAME 记录: `www` -> `@`
  - CNAME 记录: `api` -> `@` (用于后端 API)

### 1.2 服务器环境 (VPS)
- **推荐配置**: 2 CPU / 4GB RAM / 40GB SSD (DigitalOcean, Linode, 或阿里云轻量应用服务器).
- **操作系统**: Ubuntu 22.04 LTS.
- **软件栈 (Dockerized)**:
  - 使用 Docker 和 Docker Compose 编排所有服务，确保环境一致性。
  - **Web Server**: Nginx (作为反向代理和静态文件服务器).
  - **Frontend**: React 构建后的静态文件 (由 Nginx 托管).
  - **Backend**: Node.js (Express) 容器.
  - **Database**: 虽目前使用 Supabase，但自建方案可包含 PostgreSQL 容器作为备份或替代.

### 1.3 SSL 证书与安全
- **HTTPS**: 使用 Certbot (Let's Encrypt) 自动申请和续期 SSL 证书。
- **防火墙 (UFW)**:
  ```bash
  ufw allow 22/tcp   # SSH
  ufw allow 80/tcp   # HTTP
  ufw allow 443/tcp  # HTTPS
  ufw enable
  ```
- **SSH 安全**: 禁用密码登录，仅允许密钥登录；修改 SSH 端口 (可选).

## 2. 网站核心功能开发 (Core Development)

### 2.1 前端 (Frontend)
- **技术栈**: React + TypeScript + Vite + Tailwind CSS.
- **构建**: `npm run build` 生成静态资源 (`dist/`).
- **部署**: Nginx 容器挂载 `dist/` 目录进行服务.

### 2.2 后端 (Backend)
- **技术栈**: Node.js + Express.
- **现状**: 项目已有 `api/` 目录。
- **改进**: 
  - 确保 `api/index.js` 可以监听指定端口 (e.g., 3000).
  - 配置环境变量 (`.env`) 以连接 Supabase 或本地数据库.

### 2.3 数据库 (Database)
- **方案 A (Hybrid)**: 继续使用 Supabase (云端 PostgreSQL)，后端仅通过 API Key 连接。
- **方案 B (Fully Self-Hosted)**: 使用 Docker 部署 PostgreSQL + Supabase Self-hosted (较复杂) 或纯 PostgreSQL.
- **推荐**: 方案 A，降低维护成本，除非有严格的数据本地化要求。

## 3. 测试环境部署 (Test Environment)

### 3.1 架构
- **测试环境**: 部署在同一 VPS 的不同端口，或独立的测试 VPS.
- **域名**: `test.yourdomain.com`.
- **CI/CD 集成**: GitHub Actions 自动部署到测试环境.

### 3.2 自动化流程
1. 代码提交 (Push) -> 触发 GitHub Actions.
2. **Build**: 构建前端和后端.
3. **Test**: 运行单元测试和集成测试.
4. **Deploy**: 若测试通过，通过 SSH 部署到测试环境.

## 4. 测试方案实施 (Testing Strategy)

### 4.1 单元测试 (Unit Testing)
- **工具**: Vitest (兼容 Jest API，适配 Vite).
- **范围**: Utils 函数, Hooks, 纯组件.
- **目标**: 核心逻辑覆盖率 > 90%.

### 4.2 集成/端到端测试 (E2E)
- **工具**: Playwright.
- **场景**: 
  - 用户访问首页 -> 页面加载正常.
  - 切换语言 -> 内容变更.
  - 搜索论文 -> 返回结果.
  - 联系表单提交 -> 成功提示.

### 4.3 性能与安全测试
- **性能**: Lighthouse CI (集成在 GitHub Actions 中).
- **安全**: `npm audit` 检查依赖漏洞; OWASP ZAP (可选).

## 5. 监控与维护 (Monitoring & Maintenance)

### 5.1 监控系统
- **Stack**: Prometheus (收集指标) + Grafana (展示面板) + Node Exporter (主机监控).
- **应用监控**: 在 Express 后端集成 `prom-client` 暴露 `/metrics`.

### 5.2 日志与备份
- **日志**: 使用 Docker logging driver (json-file) 或集成 ELK/Loki (轻量级推荐 Loki + Promtail).
- **备份**: 编写 Shell 脚本定期备份 `.env` 文件和数据库 (如果是自建 DB).

## 6. 实施路线图 (Roadmap)

1. **配置 Docker**: 编写 Dockerfile 和 docker-compose.yml.
2. **搭建测试框架**: 安装 Vitest, 配置测试脚本.
3. **编写 CI/CD**: 创建 GitHub Actions workflow.
4. **部署监控**: 添加 Prometheus/Grafana 配置.
