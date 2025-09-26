# 牟昭阳个人网站 - Vercel 部署指南

## 部署准备

✅ 项目构建测试通过  
✅ Vercel 配置文件已创建  
✅ 无环境变量依赖  

## Vercel 部署步骤

### 方法一：通过 Vercel CLI（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```
   按提示完成登录流程

3. **部署项目**
   ```bash
   vercel
   ```
   首次部署时会询问：
   - Set up and deploy? → Yes
   - Which scope? → 选择你的账户
   - Link to existing project? → No
   - Project name → 可以使用默认或自定义
   - In which directory is your code located? → ./

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

### 方法二：通过 Vercel 网站

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账户登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 如果代码在本地，需要先推送到 Git 仓库

3. **配置部署**
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 方法三：拖拽部署（最简单）

1. **准备构建文件**
   ```bash
   npm run build
   ```

2. **访问 Vercel**
   - 打开 https://vercel.com
   - 登录账户

3. **拖拽部署**
   - 将 `dist` 文件夹直接拖拽到 Vercel 页面
   - 等待部署完成

## 部署后验证

部署完成后，Vercel 会提供一个 URL，请验证以下功能：

- ✅ 首页加载正常
- ✅ 导航菜单工作正常
- ✅ 所有页面路由正确
- ✅ 响应式设计在不同设备上正常
- ✅ 动画效果正常

## 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 注意事项

- 项目使用 React Router，`vercel.json` 已配置 SPA 路由重写
- 无需配置环境变量，项目为纯静态网站
- 构建产物在 `dist` 目录
- 支持自动部署（如果连接 Git 仓库）

## 推荐部署方式

**推荐使用方法三（拖拽部署）**，最简单快捷：
1. 运行 `npm run build`
2. 将 `dist` 文件夹拖拽到 Vercel
3. 等待部署完成

部署成功后，你的个人网站就可以通过 Vercel 提供的 URL 访问了！