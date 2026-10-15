# 数据库模型、数据字典与迁移指南 (Database Architecture)

本文档系统定义 **牟昭阳个人学术与工程网站** 的 Supabase PostgreSQL 关系型数据库模型、数据表结构、行级安全 (RLS) 策略、存储函数及数据库迁移运维规范。

---

## 1. 架构总览

系统数据持久层托管于 **Supabase (PostgreSQL 15)**。采用分级连接与安全隔离模型：

```mermaid
graph TD
    Client[客户端浏览器] -->|VITE_SUPABASE_ANON_KEY (受限)| RLS[PostgreSQL 行级安全 RLS]
    RLS -->|只读公开数据| PubData[(学术成果 / 博客 / 公开信息)]
    RLS -->|单向插入| ContactTable[(联系表单 contact_messages)]
    
    Backend[Express API 服务端] -->|SUPABASE_SERVICE_ROLE_KEY| DirectDB[(PostgreSQL 完整实例)]
    DirectDB --> CoreTables[(全量业务表 + 简历管理)]
    DirectDB --> EncryptedKeys[(加密凭据表 api_keys)]
```

- **客户端访问**: 使用匿名公钥 `VITE_SUPABASE_ANON_KEY`，所有请求严格受 RLS 策略约束，确保隐私数据无法被前端直接查阅。
- **服务端访问**: 使用私密密钥 `SUPABASE_SERVICE_ROLE_KEY`，具备绕过 RLS 策略的完整数据库操作特权，用于后端统一的业务流处理、管理鉴权与安全审计。

---

## 2. 核心数据字典 (Data Dictionary)

### 2.1 联系与留言模块 (`contact_messages`)
存储访客通过网站联系表单提交的信息：

| 字段名 | 类型 | 约束 | 默认值 | 业务含义 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | 留言唯一流水号 |
| `name` | TEXT | NOT NULL | - | 访客姓名 |
| `email` | TEXT | NOT NULL | - | 访客联系邮箱（强制小写） |
| `phone` | TEXT | NULLABLE | - | 访客联系电话 |
| `company` | TEXT | NULLABLE | - | 所在单位 / 机构名称 |
| `subject` | TEXT | NOT NULL | - | 邮件/留言主题 |
| `message` | TEXT | NOT NULL | - | 详细留言内容（10-2000 字符） |
| `collaboration_type` | TEXT | NULLABLE | - | 合作意向分类（学术合作、工作邀约等） |
| `budget_range` | TEXT | NULLABLE | - | 预算区间（可选） |
| `timeline` | TEXT | NULLABLE | - | 期望时间节点 |
| `status` | TEXT | CHECK | `'new'` | 处理状态：`new`、`read`、`replied`、`archived` |
| `created_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | 提交时间 |
| `updated_at` | TIMESTAMPTZ | NOT NULL | `NOW()` | 最后状态更新时间（触发器自动维护） |

### 2.2 学术成果展示模块 (`publications`, `patents`, `projects`, `awards`)

#### 论文成果 (`publications`)
- `title` (TEXT): 论文标题。
- `authors` (TEXT[]): 作者列表数组。
- `journal` (TEXT): 发表期刊或顶会名称。
- `year` (INTEGER): 发表年份。
- `doi` (TEXT): DOI 唯一链接标识符。
- `abstract` (TEXT): 论文摘要。
- `keywords` (TEXT[]): 关键词数组。
- `status` (TEXT): 论文状态 (`published`, `accepted`, `under_review`, `preparing`)。
- `type` (TEXT): 类型 (`journal`, `conference`)。
- `citations_count` (INTEGER): 被引用次数统计。

#### 科研与工程项目 (`projects`)
- `title` (TEXT): 项目名称。
- `description` (TEXT): 项目详述。
- `category` (TEXT): 项目分类（如 AI/ML、高性能计算、Web 架构等）。
- `status` (TEXT): 状态 (`completed`, `ongoing`, `planned`)。
- `technologies` (TEXT[]): 所用核心技术栈标签数组。
- `github_url` / `demo_url` (TEXT): 开源代码仓与在线演示链接。

### 2.3 动态简历数据模块 (`resume_*`)
专门支撑 `/resume-manager` 后台编辑与前台动态简历渲染的独立领域表集：
- `resume_personal_info`: 姓名、中英名称、个人简介、社交网络主页。
- `resume_education`: 学历学位、就读院校、主修专业、GPA、毕业时间与学术导师。
- `resume_work_experience`: 职位名称、所属机构、在职周期、工作职责与核心成就。
- `resume_research_experience`: 课题组名称、科研角色、课题描述与论文产出计数。
- `resume_skills`: 技能分类、熟练度等级与具体技能标签。
- `resume_languages`: 语言能力（如中文、英语、托福/GRE成绩等）。
- `resume_certifications`: 专业技能认证与资格证书。
- `resume_professional_activities`: 学术审稿、专业学会会员及国际交流活动。

### 2.4 应用层加密凭据管理 (`api_keys` & `api_key_usage_logs`)
用于实现高敏感外部密钥（如 OpenAI Key）在云端数据库的静态加密（Encryption at Rest）：
- `api_keys.encrypted_key`: 存储格式为 `iv:authTag:ciphertext` 的 AES-256-GCM 密文。
- `api_key_usage_logs`: 记录每次密钥调用的接口端点、HTTP 方法、状态码、响应耗时（毫秒）、报错明细及调用方客户端 IP，实现完整审计追踪。

---

## 3. 行级安全策略 (Row Level Security - RLS)

所有数据表均显式开启 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`。

| 表名 | 目标角色 | 操作 | 策略规则与说明 |
| :--- | :--- | :--- | :--- |
| `publications` / `projects` / `awards` / `patents` | `anon`, `authenticated` | SELECT | `USING (true)` 允许全球匿名用户公开查阅学术数据 |
| `publications` / `projects` / `awards` / `patents` | `anon` | INSERT/UPDATE/DELETE | 默认禁止（仅限服务端 Service Role 写入） |
| `contact_messages` | `anon` | INSERT | `WITH CHECK (true)` 允许访客提交留言 |
| `contact_messages` | `anon` | SELECT | **禁止查阅**（确保访客信息与隐私绝不被客户端嗅探） |
| `api_keys` | `anon` | ALL | 仅允许调用 `get_api_key_info` 存储过程，直接查表被拒绝 |

---

## 4. 存储过程与触发器函数

### 4.1 自动维护时间戳触发器
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```
在所有具备 `updated_at` 的数据表上均挂载了 `BEFORE UPDATE` 触发器，确保任何记录变动时自动校准为服务端真实系统时间。

### 4.2 密钥调用日志记录过程 (`update_api_key_usage`)
采用 `SECURITY DEFINER` 特权执行：在原子事务内同时递增密钥使用计数、刷新最后调用时间，并在 `api_key_usage_logs` 表中插入结构化审计日志。

---

## 5. 迁移管理与发布规程 (Migrations Workflow)

### 5.1 目录组织与命名
所有数据库变更脚本均集中于 `supabase/migrations/`：
```text
supabase/migrations/
├── 001_initial_schema.sql             # 基础骨架（论文、项目、联系表单）
├── 002_initial_data.sql               # 初始种子数据
├── 003_chat_assistant_schema.sql      # 智能问答会话表结构
├── 004_upload_tables.sql              # 文件上传与多媒体映射
├── 005_secure_key_management.sql      # AES 加密密钥库与审计
├── 006_security_enhancements.sql      # 安全强化与索引调优
├── 007_blog_system.sql                # 个人技术博客系统
├── 008_social_interactions.sql        # 评论与社交互动扩展
├── 009_performance_monitoring.sql     # 性能上报与链路分析
├── 20241119_create_resume_tables.sql  # 早期简历数据方案
└── 20251206_create_resume_tables.sql  # 当前生效的 resume_* 规范表
```

### 5.2 迁移红线守则
1. **不可变原则 (Immutability)**: 严禁直接改写已经上线生效的历史迁移文件。
2. **前滚迁移 (Forward-Only)**: 任何字段新增、表结构调整或索引变更，必须在 `supabase/migrations/` 下创建新的递增 SQL 脚本。
3. **备份先行**: 在生产数据库执行重大 DDL 变更前，必须登录 Supabase 控制台或使用 `pg_dump` 完成冷备。
