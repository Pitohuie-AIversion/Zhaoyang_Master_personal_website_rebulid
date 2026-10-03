# 安全审计例外

安全例外必须有明确影响分析、补偿控制、负责人复核和到期日。`npm run audit:prod` 只允许本文件对应的高危公告；新增或过期公告会使 CI 失败。

## GHSA-qwww-vcr4-c8h2

- 依赖：`react-router` / `react-router-dom`
- 到期日：2026-10-31
- 影响：公告仅影响不稳定的 React Server Components（RSC）API。
- 适用性：本项目是 Vite 客户端 SPA，使用声明式浏览器路由，没有启用 RSC、服务端 action 或对应不稳定 API。
- 补偿控制：保留 Dependabot 和每次 CI 的生产依赖审计；任何新增 RSC 使用都必须先移除此例外并升级到修复版本。
- 退出条件：React Router 发布与当前 SPA 兼容的修复版本后立即升级，并删除脚本与本文中的例外。

复核时应重新阅读[官方 GitHub 安全公告](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)，确认影响条件与上游修复状态没有变化。
