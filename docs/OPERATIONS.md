# 运维手册

本文定义该网站的最低生产运维闭环。Vercel 是当前主要交付路径，Docker Compose 用于可移植自托管。

## 服务与探针

| 服务 | 探针 | 正常条件 |
| --- | --- | --- |
| 前端 Nginx | `GET /healthz` | HTTP 200，正文 `ok` |
| API | `GET /api/health` | HTTP 200，`status=ok` |
| API 指标 | `GET /api/metrics` | HTTP 200，Prometheus 文本格式 |

`/api/health` 中的外部服务状态用于诊断功能降级。它不主动查询第三方，因此不应被视为 Supabase 或 OpenAI 的完整可用性证明。

## 发布前检查

1. 确认工作区只包含本次发布内容，并完成代码评审。
2. 运行 `npm ci` 和 `npm run verify`。
3. 联网运行 `npm run audit:prod`，处理所有高危及严重漏洞。
4. 核对 `.env.example` 与部署平台变量，确保服务端密钥未使用 `VITE_` 前缀。
5. 数据库变更先在非生产环境执行，并记录回滚或前滚方案。
6. 部署预览环境，检查首页、关键导航、联系表单、中英切换和管理入口。

`npm run verify` 包含临时端口上的 API 冒烟测试，自动验证 `/api/health` 和 `/api/metrics`，不会依赖固定的本地端口。

## 发布与回滚

### Vercel

- 合并受保护分支后由平台构建发布；生产环境不得依赖本地 `.env`。
- 发布后立即检查站点、`/api/health`、关键 API 和平台函数日志。
- 发生回归时优先使用 Vercel 上一个成功部署进行即时回滚，再修复主分支。

### Docker Compose

```bash
docker compose config
docker compose up --build -d
docker compose ps
```

需要监控栈时使用：

```bash
docker compose --profile monitoring up -d
```

回滚时重新部署上一个已验证的 Git 标签或镜像摘要。不要使用未记录的本地目录作为生产回滚源。

## 监控与告警

Prometheus 默认每 15 秒抓取 `/api/metrics`，当前提供进程存活时间、常驻内存和按方法/状态码聚合的请求计数。建议至少配置：

- 连续 5 分钟健康检查失败；
- 5xx 比例持续升高；
- 容器反复重启；
- 内存持续增长或接近平台限制；
- Supabase/OpenAI 相关功能持续返回 503。

请求日志为单行 JSON，可按 `timestamp`、`method`、`path`、`status` 和 `durationMs` 检索。日志中禁止记录 Authorization、Cookie、请求正文和密钥。

## 事件响应

1. 确认影响范围、开始时间与最近变更，保存必要日志。
2. 优先止损：回滚、关闭受影响功能、收紧访问或吊销密钥。
3. 检查 API 健康、部署日志、第三方服务状态和数据库变更。
4. 修复后在预览环境复现并验证，再恢复生产流量。
5. 记录根因、时间线、用户影响、修复项和预防措施。

若怀疑密钥泄露，必须先在对应平台吊销和轮换，再清理代码与 Git 历史。

临时接受的依赖风险记录在 `docs/SECURITY_EXCEPTIONS.md`。例外到期或影响条件变化时，生产审计会失败；不得通过延长日期替代升级与验证。

## 数据与备份

- Supabase 数据库应启用平台备份或定期导出，并定期演练恢复。
- 迁移文件保存在 `supabase/migrations/`，生产执行前应检查编号冲突和重复语义。
- 备份必须加密、限制访问并定义保留期限；恢复演练不得覆盖生产数据。
- 静态简历与站点资源由 Git 和部署产物恢复，不把 `dist/` 当作源备份。

## 例行维护

- 每周：处理 Dependabot、生产依赖审计与失败的 CI。
- 每月：检查监控告警、访问权限、过期凭据和恢复能力。
- 每季度：轮换高权限凭据，复核 CORS/CSP、管理员接口、数据库策略和事件预案。
