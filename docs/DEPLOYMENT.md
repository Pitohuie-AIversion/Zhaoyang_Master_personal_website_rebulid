# 生产部署与交付指南 (Deployment Guide)

本项目支持两种生产交付路径：
1. **主要路径 (云原生推荐)**: 基于 **Vercel** 部署前端静态产物并由 Vercel Serverless Function 运行后端 Express API (`api/index.js`)，边缘搭配 Cloudflare 提供 CDN 与安全防护。
2. **备用路径 (自建可移植)**: 基于 **Docker Compose** 在独立 VPS 或私有云服务器上编排前端 Nginx、后端 Node.js 容器与 Prometheus/Grafana 监控栈。

---

## 路径一：Vercel 自动化部署 (推荐)

### 1. 部署前准备
在提交代码触发 Vercel 构建前，确保本地通过质量门禁：
```bash
npm run verify
```

### 2. 配置 Vercel 环境变量 (Environment Variables)
在 Vercel 控制台 **Project Settings → Environment Variables** 中必须配置以下服务端变量（按需区分 Production 与 Preview）：

- **服务端私密密钥**:
  - `SUPABASE_SERVICE_ROLE_KEY`: Supabase 服务角色密钥
  - `KEY_ENCRYPTION_KEY`: 应用层 AES-256 加密主密钥（32 字符）
  - `ADMIN_TOKEN`: 后台管理鉴权 Bearer 令牌
  - `OPENAI_API_KEY`: OpenAI API 密钥
- **公开构建参数**:
  - `VITE_SUPABASE_URL`: Supabase API 地址
  - `VITE_SUPABASE_ANON_KEY`: Supabase 匿名公钥
  - `VITE_GOOGLE_ANALYTICS_ID`: GA4 追踪 ID（可选）
  - `VITE_ALLOW_INLINE_JSONLD`: 设置为 `true`
- **安全与跨域**:
  - `CORS_ORIGIN`: 生产域名（如 `https://zhaoyangmu.cloud,https://www.zhaoyangmu.cloud`）

> [!CAUTION]
> 绝对不要在 Vercel 环境变量中为敏感密钥（如 `SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_TOKEN`）添加 `VITE_` 前缀，否则会被打包进前端 JS 文件并向全网泄露。

### 3. 部署方式

#### 方法 A：Git 联动自动部署（最佳实践）
1. 将本地修改推送至 GitHub 仓库的主分支 (`master` 或 `main`)。
2. Vercel 自动检测到推送并触发流水线：
   - 自动执行 `npm run build` 生成 `dist/` 目录。
   - 自动将 `api/index.js` 部署为 Serverless Function。
   - 根据 `vercel.json` 自动配置路由重写与安全头。

#### 方法 B：使用 Vercel CLI
```bash
# 1. 登录
vercel login

# 2. 预览部署
vercel

# 3. 正式生产部署
vercel --prod
```

---

## 路径二：Docker Compose 独立容器化部署

适用于需要自建 VPS (如 Ubuntu 22.04 LTS) 或对数据主权有极高要求的场景。

### 1. 配置文件检查
确保服务器上具有以下配置文件：
- `docker-compose.yml`
- `Dockerfile.frontend`
- `Dockerfile.backend`
- `nginx.conf`
- `prometheus.yml`
- `.env` (包含完整生产环境变量)

### 2. 构建与运行命令
```bash
# 校验配置
docker compose config

# 启动核心应用服务 (前端 Nginx + 后端 Express API)
docker compose up --build -d

# 启动包含 Prometheus 与 Grafana 监控栈的完整生产集群
docker compose --profile monitoring up --build -d

# 查看容器运行状态
docker compose ps
```

- **前端静态访问**: `http://<YOUR_IP>:80`
- **后端 API 服务**: `http://<YOUR_IP>:3000/api`
- **Prometheus 指标系统**: `http://<YOUR_IP>:9090`
- **Grafana 可视化仪表盘**: `http://<YOUR_IP>:3001`

---

## 部署后全面验证核对单 (Verification Checklist)

无论采用哪种部署方式，发版后请立即依次验证以下核心功能：

- [ ] **存活探针**: `GET https://<YOUR_DOMAIN>/api/health` 必须返回 HTTP 200 且 `status: "ok"`。
- [ ] **指标探针**: `GET https://<YOUR_DOMAIN>/api/metrics` 必须返回有效 Prometheus 文本格式。
- [ ] **多语言切换**: 首页中英文切换按钮响应迅速，文案无缺失或空白键名。
- [ ] **简历下载**: 点击中文简历下载 `/cn_resume.pdf` 与英文简历下载 `/en_resume.pdf` 能够顺利触发下载且文件完整。
- [ ] **智能问答**: 悬浮对话框输入问题，GPT 助手正常生成回答且无 500/503 报错。
- [ ] **联系留言**: 提交测试留言，收到成功提示并在数据库或管理员后台显示。
- [ ] **管理鉴权**: 尝试无凭据访问 `/resume-manager`，被安全守卫弹窗拦截。

---

## 开发记录 & 历史更新日志 (Changelog Archive)

### 2025-01-27

#### 🐛 Bug 修复

**1. Research页面翻译键显示问题**
- **问题描述**: Research页面中的"学术成果"、"专利"、"获奖"三个标题无法正确显示，控制台报错缺少翻译键
- **问题原因**: `Research.tsx` 中使用了 `t('research.publications.title')`、`t('research.patents.title')`、`t('research.awards.title')` 翻译键，但在 `zh.json` 和 `en.json` 中缺少对应的键值对
- **解决方案**: 
  - 在 `src/locales/zh.json` 的 `research` 对象中添加了缺失的翻译键
  - 在 `src/locales/en.json` 的 `research` 对象中添加了对应的英文翻译
  - 确保中英文翻译键名称一致，内容准确
- **影响文件**: 
  - `src/locales/zh.json`
  - `src/locales/en.json`
- **验证结果**: ✅ Research页面标题正常显示，语言切换功能正常

**2. 首页头像图片加载失败问题**
- **问题描述**: 首页个人头像图片无法加载，浏览器报404错误
- **问题原因**: `Home.tsx` 中使用了错误的绝对路径 `"/src/assets/me_Nero_AI_Image_Upscaler_Photo_Face.jpeg"`，Vite无法正确解析此路径
- **解决方案**:
  - 在 `Home.tsx` 中添加正确的图片导入语句：`import profileImage from '../assets/me_Nero_AI_Image_Upscaler_Photo_Face.jpeg';`
  - 将 `LazyImage` 组件的 `src` 属性从硬编码路径改为导入的变量：`src={profileImage}`
- **影响文件**: `src/pages/Home.tsx`
- **验证结果**: ✅ 头像图片正常显示，在开发和生产环境中都能正确加载

**3. 网站右下角"trae"调试信息显示问题**
- **问题描述**: 网站右下角显示调试信息"主题: matrix | 律动: heartbeat | 强度: medium"，影响用户体验
- **问题原因**: `ZhaoyangASCIIRhythm.tsx` 组件中的 `.rhythm-info` 调试信息区域在所有环境下都会显示
- **解决方案**:
  - 使用环境变量判断，仅在开发环境下显示调试信息
  - 添加条件渲染：`{process.env.NODE_ENV === 'development' && (...调试信息...)}`
  - 保留开发时的调试功能，同时确保生产环境的界面整洁
- **影响文件**: `src/components/ZhaoyangASCIIRhythm.tsx`
- **验证结果**: ✅ 生产环境下不再显示调试信息，开发环境保留调试功能