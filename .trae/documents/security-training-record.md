# 团队安全意识培训记录

**日期**: 2025-12-06
**主题**: 敏感信息保护与安全开发规范
**参与人员**: 开发团队全员

## 1. 培训目标
- 提高团队成员对敏感信息（API Key, Credentials, Secrets）泄露风险的认识。
- 规范开发过程中的密钥管理流程。
- 掌握新引入的自动化安全扫描工具的使用。

## 2. 核心培训内容

### 2.1 什么是敏感信息？
- **API 密钥**: OpenAI API Key, Google Maps Key 等。
- **数据库凭证**: Supabase Service Role Key, Database Connection String。
- **私钥/证书**: SSH Private Keys, TLS Certificates。
- **内部 Token**: JWT Secrets, Encryption Keys。

### 2.2 为什么不能硬编码？
- **代码泄露风险**: 代码库一旦泄露（如误设为公开仓库），所有密钥即刻失效，可能导致数据被删、产生巨额账单。
- **历史记录残留**: 即使后续删除，Git 历史中仍可找回。
- **环境隔离困难**: 硬编码无法区分开发、测试和生产环境。

### 2.3 正确的密钥管理规范
1.  **本地开发**: 使用 `.env` 文件存储密钥，并确保 `.env` 在 `.gitignore` 中。
2.  **代码引用**:
    - **Node.js (脚本/后端)**: 使用 `dotenv` 加载，通过 `process.env.KEY_NAME` 访问。
    - **Vite (前端)**: 仅公开非敏感密钥（如 Firebase Config, Public Keys），使用 `import.meta.env.VITE_KEY_NAME`。**严禁**在前端代码中使用 Service Role Key 或 OpenAI Secret Key。
3.  **生产环境**: 在部署平台（Vercel, AWS, Docker）的控制台设置环境变量，禁止将 `.env` 打包上传。

### 2.4 新工具使用指南
我们引入了自动化扫描脚本来辅助安全检查。

- **运行命令**: `npm run scan:secrets`
- **何时运行**:
    - 在提交代码（git commit）之前。
    - 在添加新脚本或配置文件之后。
- **处理报错**:
    - 如果扫描发现“FAIL”，请立即检查对应行。
    - 如果是误报（如 placeholder），请确认是否包含 `EXAMPLE` 或 `your-` 等标识，或联系安全负责人。
    - 如果是真实密钥，**立即**将其移至环境变量，并从代码中删除。如果密钥已提交到远程仓库，必须**立即废弃并轮换**该密钥。

## 3. 常见场景与最佳实践
- **场景 A**: 需要写一个临时脚本测试数据库。
    - **错误**: `const supabase = createClient('url', 'secret_key_string');`
    - **正确**:
      ```javascript
      import dotenv from 'dotenv';
      dotenv.config();
      const supabase = createClient(process.env.URL, process.env.KEY);
      ```
- **场景 B**: 需要在前端调用 OpenAI。
    - **错误**: 在前端直接使用 OpenAI API Key 发起 fetch 请求。
    - **正确**: 创建后端 API 路由（如 `/api/chat`），前端请求该路由，后端使用存储在环境变量中的 Key 调用 OpenAI。

## 4. 培训考核
- 所有成员需阅读并签署本记录。
- 下一次代码提交前，必须通过 `npm run scan:secrets` 检查。

---
**记录人**: Trae AI Assistant
