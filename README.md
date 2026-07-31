# 牟昭阳个人网站

一个基于 React、TypeScript、Vite 与 Express 的中英双语个人网站，包含个人履历、项目、研究成果、博客、联系表单和受保护的内容管理接口。

- 线上站点：[zhaoyangmu.cloud](https://zhaoyangmu.cloud)
- 前端：React 18、TypeScript、Vite 6、Tailwind CSS
- 后端：Node.js 22、Express、Supabase、OpenAI API
- 交付：Vercel，或 Docker Compose 自托管

## 本地开发

要求 Node.js 22+ 与 npm 10+。

```bash
npm ci
cp .env.example .env
npm run dev:full
```

默认地址：

- 前端开发服务器：`http://localhost:5173`
- API：`http://localhost:3001/api`
- 健康检查：`http://localhost:3001/api/health`
- Prometheus 指标：`http://localhost:3001/api/metrics`

Windows PowerShell 若禁止执行 `npm.ps1`，可使用同等命令 `npm.cmd run dev:full`，无需修改系统执行策略。

## 环境变量

从 [.env.example](./.env.example) 创建本地 `.env`。不要提交 `.env`、服务角色密钥、管理员令牌或 OpenAI 密钥。

主要配置分组：

- `VITE_*`：会进入浏览器构建产物，只能存放可公开配置。
- `SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_TOKEN`、`KEY_ENCRYPTION_KEY`：仅限服务端。
- `CORS_ORIGIN`：允许的来源，多个来源使用英文逗号分隔。
- `USE_LOCAL_PROXY`：仅用于显式开启本地开发代理，生产环境始终禁用。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动前端开发服务器 |
| `npm run dev:api` | 启动本地 API |
| `npm run dev:full` | 同时启动前端与 API |
| `npm run verify` | 执行类型、代码规范、覆盖率、翻译、密钥扫描与构建检查 |
| `npm run test:run` | 单次运行测试 |
| `npm run test:api` | 启动临时 API 并验证健康检查与 Prometheus 指标 |
| `npm run test:coverage` | 生成 `coverage/` 报告并执行基础回归门槛 |
| `npm run audit:prod` | 检查生产依赖中的高危漏洞 |
| `npm run build` | 生成生产构建到 `dist/` |

## 质量与安全基线

Pull Request 会通过 GitHub Actions 自动执行：

1. 锁文件安装、类型检查与 ESLint；
2. 测试及覆盖率报告；
3. 中英翻译结构校验；
4. 仓库密钥扫描与生产依赖审计；
5. 生产构建。

Dependabot 每周检查 npm 依赖、每月检查 GitHub Actions。覆盖率门槛是用于防止回退的初始基线，新增业务应同时补充针对性测试。

## 部署

Vercel 配置位于 `vercel.json`。自托管方式：

```bash
docker compose up --build -d
docker compose --profile monitoring up --build -d
```

第二条命令会额外启动 Prometheus（`:9090`）与 Grafana（`:3001`）。生产部署前必须通过平台密钥管理注入 `.env.example` 中的服务端变量。

详细流程与故障处理见：

- [运维手册](./docs/OPERATIONS.md)
- [部署说明](./docs/DEPLOYMENT.md)
- [自托管架构](./docs/SELF_HOSTED_ARCHITECTURE.md)
- [贡献指南](./CONTRIBUTING.md)
- [安全策略](./SECURITY.md)
- [安全审计例外](./docs/SECURITY_EXCEPTIONS.md)

## 目录

```text
api/         Express API、路由与服务
public/      静态公开资源
src/         React 应用源码
supabase/    数据库迁移
tests/       历史与手工验证资产
scripts/     构建、检查、安全和维护脚本
docs/        部署、架构与运维文档
```

本仓库未声明开源许可证；除非仓库所有者另行授权，保留所有权利。
