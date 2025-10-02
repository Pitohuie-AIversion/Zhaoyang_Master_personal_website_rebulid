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

---

## 开发记录 & 更新日志

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

#### 📋 技术改进

- **多语言支持**: 完善了翻译键的管理，确保所有界面文案都通过翻译系统获取
- **资源管理**: 改进了静态资源的导入方式，使用ES6模块导入替代硬编码路径
- **环境区分**: 增强了开发和生产环境的区分，优化用户体验

#### 🔍 质量保证

- 所有修复都经过了本地测试验证
- 确保修改不影响现有功能
- 保持代码的可维护性和可读性
- 遵循项目的编码规范和最佳实践