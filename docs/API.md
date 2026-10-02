# RESTful API 接口规范与数据契约 (API Reference)

本文档定义 **牟昭阳个人学术与工程网站** 后端 API 接口规范、安全鉴权、限流规则及请求响应数据格式。

---

## 1. 基础信息

### 1.1 服务端地址基准 (Base URLs)
- **本地开发环境**: `http://localhost:3001/api`
- **生产云端环境**: `https://zhaoyangmu.cloud/api` (由 Cloudflare 代理并分发至 Vercel Serverless)

### 1.2 鉴权机制 (Authentication)
本项目对前台用户与管理接口实施分级权限控制：
- **公共端点**: 无需凭据，但受 IP 级别滑动窗口限流保护。
- **管理员保护端点**: 必须在请求头中携带安全 Bearer Token：
  ```http
  Authorization: Bearer <ADMIN_TOKEN>
  ```
  服务端使用恒常时间算法（`crypto.timingSafeEqual`）防时序攻击。鉴权失败时统一返回：
  - `401 Unauthorized` (`ADMIN_AUTH_REQUIRED`): 缺少或令牌不匹配。
  - `503 Service Unavailable` (`ADMIN_NOT_CONFIGURED`): 服务端未配置 `ADMIN_TOKEN` 环境变量。

### 1.3 通用错误响应契约
所有非 2xx 异常均返回统一 JSON 结构：
```json
{
  "error": "人类可读的错误描述信息",
  "code": "MACHINE_READABLE_ERROR_CODE"
}
```

### 1.4 全局限流策略 (Rate Limiting)
通过标准响应头暴露配额余量：
- `RateLimit-Limit`: 当前时间窗口允许的最大请求数。
- `RateLimit-Remaining`: 当前窗口内剩余可用请求数。
- `RateLimit-Reset`: 限流重置倒计时（秒）。

| 端点组 | 窗口时长 | 配额上限 | 违规响应 |
| :--- | :--- | :--- | :--- |
| **智能聊天 (Chat)** | 15 分钟 | 50 次 / IP | `429 Too Many Requests` |
| **联系表单 (Contact)** | 15 分钟 | 10 次 / IP | `429 Too Many Requests` |
| **文件上传 (Upload)** | 15 分钟 | 20 次 / IP | `429 Too Many Requests` |

---

## 2. 系统与探针接口 (System & Probes)

### 2.1 基础健康检查
- **请求**: `GET /api/health`
- **鉴权**: 无需
- **响应格式**: `application/json`
```json
{
  "status": "ok",
  "timestamp": "2026-10-02T08:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "supabase": "connected",
    "openai": "connected",
    "keyManager": "available"
  }
}
```

### 2.2 详细服务与环境状态
- **请求**: `GET /api/status`
- **鉴权**: 无需
- **响应示例**:
```json
{
  "timestamp": "2026-10-02T08:00:00.000Z",
  "services": {
    "database": "connected",
    "ai": "connected",
    "key_management": "available"
  },
  "environment": {
    "node_env": "production",
    "has_supabase_url": true,
    "has_supabase_key": true,
    "has_openai_key": true
  }
}
```

### 2.3 Prometheus 监控指标探针
- **请求**: `GET /api/metrics`
- **鉴权**: 无需
- **响应格式**: `text/plain; version=0.0.4`
- **指标清单**:
  - `app_uptime_seconds`: 应用累计运行存活秒数（Gauge）。
  - `process_resident_memory_bytes`: Node.js 进程 RSS 常驻内存大小（Gauge）。
  - `http_requests_total{method="...", status="..."}`: 按请求方法与状态码聚合的累计请求总数（Counter）。

---

## 3. 智能问答接口 (Chat Assistant)

### 3.1 提交对话交互
- **请求**: `POST /api/chat/completions`
- **限流**: 50 次 / 15 分钟
- **请求体 (JSON)**:
```json
{
  "message": "请问牟昭阳的主要研究领域是什么？",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "context": ["上一轮问答内容（可选）"],
  "language": "zh"
}
```
- **字段规范**:
  - `message`: (string, 必填) 非空文本，最大长度 1000 字符。
  - `sessionId`: (string, 可选) 客户端会话唯一标示。
  - `context`: (string[] | string, 可选) 上下文对话历史。
  - `language`: (string, 可选) `zh` \| `en`，默认 `en`。
- **响应示例 (200 OK)**:
```json
{
  "response": "牟昭阳的研究领域主要集中在高性能计算、分子动力学模拟以及基于深度学习的生物物理结构预测……",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-10-02T08:00:02.000Z",
  "usage": {
    "prompt_tokens": 128,
    "completion_tokens": 85,
    "total_tokens": 213
  }
}
```

### 3.2 历史兼容对话端点
- **请求**: `POST /api/chat/message`
- **说明**: 为兼容早期前端组件设计，响应中额外包含 `reply` 与 `relatedLinks` 字段。

---

## 4. 联系与留言管理 (Contact Inquiries)

### 4.1 提交联系表单 (公开)
- **请求**: `POST /api/contact/submit`
- **限流**: 10 次 / 15 分钟
- **请求体 (JSON)**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "+86 13800000000",
  "company": "清华大学",
  "subject": "学术访问邀请",
  "message": "希望邀请您参加下周的青年学者学术研讨会，不知是否有空？",
  "collaborationType": "academic",
  "budget": "N/A",
  "timeline": "2026年11月",
  "language": "zh"
}
```
- **校验约束**:
  - `name`: 必填非空。
  - `email`: 必填，标准邮箱正则校验。
  - `subject`: 必填非空。
  - `message`: 必填，长度必须在 **10 ~ 2000** 字符之间。
- **成功响应 (200 OK)**:
```json
{
  "success": true,
  "message": "您的消息已成功发送，我会尽快回复您！",
  "data": {
    "id": "e3b0c442-98fc-1c14-9afbf4c8996fb924",
    "name": "张三",
    "email": "zhangsan@example.com",
    "status": "new",
    "created_at": "2026-10-02T08:00:00.000Z"
  }
}
```

### 4.2 获取留言列表 (需管理员权限)
- **请求**: `GET /api/contact/messages?page=1&pageSize=20`
- **请求头**: `Authorization: Bearer <ADMIN_TOKEN>`
- **成功响应 (200 OK)**:
```json
{
  "data": [
    {
      "id": "e3b0c442-98fc-1c14-9afbf4c8996fb924",
      "name": "张三",
      "email": "zhangsan@example.com",
      "subject": "学术访问邀请",
      "message": "...",
      "status": "new",
      "created_at": "2026-10-02T08:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20
}
```

### 4.3 留言统计聚合 (需管理员权限)
- **请求**: `GET /api/contact/stats`
- **请求头**: `Authorization: Bearer <ADMIN_TOKEN>`
- **响应示例**:
```json
{
  "stats": {
    "total": 42,
    "byStatus": {
      "new": 5,
      "read": 12,
      "replied": 20,
      "archived": 5
    },
    "recentCount": 18
  }
}
```

### 4.4 变更留言状态 (需管理员权限)
- **请求**: `PATCH /api/contact/messages/:id/status`
- **请求头**: `Authorization: Bearer <ADMIN_TOKEN>`
- **请求体**: `{"status": "read"}`（枚举值：`new`, `read`, `replied`, `archived`）

---

## 5. 简历动态数据管理 (Resume Management - Admin)

全部端点挂载于 `/api/resume/*`，由 `requireAdmin` 拦截保护。

### 5.1 获取全量聚合简历数据
- **请求**: `GET /api/resume/data`
- **请求头**: `Authorization: Bearer <ADMIN_TOKEN>`
- **响应示例**:
```json
{
  "success": true,
  "data": {
    "personal_info": { "full_name": "牟昭阳", "english_name": "Zhaoyang Mu", "email": "..." },
    "education": [ { "id": "...", "degree": "硕士", "school": "哈尔滨工业大学" } ],
    "work_experience": [ ... ],
    "research_experience": [ ... ],
    "skills": [ ... ],
    "languages": [ ... ],
    "certifications": [ ... ],
    "professional_activities": [ ... ],
    "publications": [ ... ],
    "patents": [ ... ],
    "awards": [ ... ]
  }
}
```

### 5.2 增量更新履历模块
支持的 `:section` 包括：`personal_info`、`education`、`work_experience`、`research_experience`、`skills`、`languages`、`certifications`、`professional_activities`。
- **新增项**: `POST /api/resume/data/:section`
  - Body: 包含该表对应字段键值对。
- **更新项**: `PUT /api/resume/data/:section/:id`
  - Body: 待变更字段（自动更新 `updated_at`）。
- **删除项**: `DELETE /api/resume/data/:section/:id`

---

## 6. 学术与项目展示 (Academics & Projects)

### 6.1 论文成果检索
- **请求**: `GET /api/academics/publications`
- **参数**:
  - `category`: (可选) 过滤分类，默认 `all`。
  - `limit`: (可选) 返回上限，默认 `50`。
  - `language`: (可选) `zh` \| `en`。
- **响应示例**:
```json
{
  "publications": [
    {
      "id": "...",
      "title": "Machine Learning for Biomolecular Dynamics...",
      "authors": ["Zhaoyang Mu", "Co-author"],
      "journal": "Journal of Chemical Information and Modeling",
      "year": 2024,
      "doi": "10.1021/acs.jcim.xxxx"
    }
  ],
  "count": 1,
  "language": "en",
  "category": "all"
}
```

### 6.2 科研工程项目列表
- **请求**: `GET /api/academics/projects`
- **参数**: `category`（分类）、`limit`（条数上限）。

---

## 7. 辅助服务与文件上传 (Utilities & Upload)

### 7.1 文件上传 (需管理员权限)
- **请求**: `POST /api/upload/file`
- **请求头**: 
  - `Authorization: Bearer <ADMIN_TOKEN>`
  - `Content-Type: multipart/form-data`
- **表单字段**:
  - `file`: 二进制文件数据（限制 10MB，仅允许 `jpeg`、`png`、`gif`、`pdf`）。
  - `category`: (string) 上传分类归属。
- **响应示例**:
```json
{
  "success": true,
  "message": "文件上传成功",
  "file": {
    "filename": "certificate.pdf",
    "mimetype": "application/pdf",
    "size": 1048576,
    "sizeFormatted": "1.00 MB"
  }
}
```

### 7.2 知识库语义搜索
- **请求**: `GET /api/knowledge/search?query=分子动力学&language=zh&limit=10`
- **说明**: 基于数据库 ILIKE 多字段模糊匹配，作为大模型检索增强 (RAG) 补充。
