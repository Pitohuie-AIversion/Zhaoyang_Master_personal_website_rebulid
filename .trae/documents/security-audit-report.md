# 安全审计与修复报告

**日期**: 2025-12-06
**审计对象**: 牟昭阳个人学术网站
**审计员**: Trae AI Assistant

## 1. 摘要
本次审计旨在全面检查并修复网站中直接暴露的键名（API密钥、数据库凭证等）安全漏洞。通过静态代码分析、手动审查和自动化扫描，我们识别并修复了多个潜在的安全风险点，特别是脚本文件中的硬编码凭证。同时，我们实施了自动化的安全扫描机制，以防止未来发生类似泄漏。

## 2. 发现的问题与修复措施

### 2.1 脚本文件中的硬编码凭证 (高风险)
- **问题**: 在 `scripts/cleanup_and_checks/` 目录下的多个维护脚本（`check_contact.js`, `check_database_structure.js`, `check_table_schema.js`）以及根目录下的 `test_api_endpoints.js` 中，发现直接硬编码了 Supabase Service Role Key（最高权限密钥）。
- **修复**: 
  - 移除了所有硬编码的密钥字符串。
  - 引入 `dotenv` 库加载环境变量。
  - 将代码修改为从 `process.env.SUPABASE_SERVICE_ROLE_KEY` 读取密钥。
  - 添加了对环境变量是否存在的检查逻辑。

### 2.2 备份文件中的残留密钥 (中风险)
- **问题**: `backup/routes/test-security.js` 文件中包含用于测试的硬编码 API 密钥（虽然看似伪造，但存在误导和潜在风险）。
- **修复**: 删除了该备份文件。

### 2.3 内容安全策略 (CSP) 配置 (低风险)
- **问题**: `api/services/combined.js` 中的 CSP 头部配置硬编码了 Supabase 的 URL。虽然这是公开 URL，但不够灵活。
- **修复**: 修改为优先使用环境变量 `process.env.VITE_SUPABASE_URL`，保持硬编码作为备选。

### 2.4 环境变量文件 (检查项)
- **检查**: 确认 `.env` 文件包含敏感信息但已正确包含在 `.gitignore` 中，未提交到版本控制系统。
- **状态**: ✅ 已安全配置。

### 2.5 前端代码暴露 (检查项)
- **检查**: 审计了 `src/` 目录下的前端代码，确认没有直接暴露 `SUPABASE_SERVICE_ROLE_KEY` 或 `OPENAI_API_KEY`。
- **状态**: ✅ 安全。所有敏感操作均通过 API 代理或 Serverless Functions 进行。

## 3. 新增安全机制

### 3.1 自动化密钥扫描
- **新增**: 创建了 `scripts/security-scan.js` 脚本。
- **功能**: 扫描项目文件（排除 `node_modules` 等），检测常见的密钥格式（AWS, OpenAI, Private Keys, Generic Secrets）。
- **集成**: 在 `package.json` 中添加了 `npm run scan:secrets` 命令。建议在 CI/CD 流程或提交前运行此命令。

## 4. 安全验证
- **扫描测试**: 运行 `npm run scan:secrets`，结果显示 **PASS**（无明显泄漏）。
- **功能测试**: 修复后的脚本（如 `check_contact.js`）在正确配置环境变量的环境下可正常运行。

## 5. 建议与后续行动
1.  **定期轮换密钥**: 建议在 Supabase 控制台定期轮换 Service Role Key。
2.  **生产环境配置**: 确保生产环境（如 Vercel）的环境变量配置正确，不要上传 `.env` 文件。
3.  **开发规范**: 所有新加入的脚本必须使用 `dotenv` 加载配置，禁止硬编码。

---
**状态**: 修复完成
