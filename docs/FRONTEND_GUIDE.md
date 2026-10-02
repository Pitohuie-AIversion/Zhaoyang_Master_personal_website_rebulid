# 前端架构、设计系统与组件指南 (Frontend Architecture & Design)

本文档面向前端与 UI/UX 工程师，深入阐述 **牟昭阳个人学术与工程网站** 前端工程的设计系统、目录规范、主题与暗色模式、中英多语言体系、视觉特效以及性能优化最佳实践。

---

## 1. 架构原则与设计理念

1. **高阶视觉质感 (Premium Aesthetics)**: 融合学术严谨与现代极客科技感，采用玻璃拟态 (Glassmorphism)、微交互动画与流畅渐变。
2. **零硬编码文案 (Zero Hardcoded Strings)**: 所有展示文本全面收敛至国际化翻译字典中，确保无障碍与跨语言体验无死角。
3. **极速交互性能 (Peak Performance)**: 严格执行组件懒加载 (Lazy Loading)、视口相交观察器 (IntersectionObserver) 图像加载与最小重绘。
4. **全方位无障碍支持 (Universal Accessibility - a11y)**: 符合 WCAG 2.1 AA 标准，支持键盘无障碍跳转、字体放大与对比度增强。

---

## 2. 目录规范与组件树分层

```text
src/
├── assets/                    # 静态多媒体资源（个人头像、科研图形徽标）
├── components/
│   ├── common/                # 跨业务通用底层底座
│   │   ├── DarkModeProvider.tsx       # 暗色模式状态与监听
│   │   ├── TranslationProvider.tsx    # i18n 国际化包装
│   │   ├── ErrorBoundary.tsx          # 统一运行时容灾与错误降级
│   │   └── GlobalOptimizationManager.tsx # 全局性能与资源调度
│   ├── layout/                # 全局页面骨架
│   │   ├── Navbar.tsx                 # 顶部响应式导航栏
│   │   ├── Footer.tsx                 # 底部版权与学术学术外部链接
│   │   └── AccessibilityEnhancements.tsx # 无障碍工具条与跳过导航
│   ├── features/              # 核心业务领域特性（高内聚）
│   │   ├── blog/              # 博客列表与 Markdown 文章解析器
│   │   ├── chat/              # 悬浮智能问答助手与会话交互
│   │   ├── home/              # 首页英雄区、ASCII 律动背景
│   │   ├── resume/            # 简历全能可视化管理后台 (ResumeManager)
│   │   ├── research/          # 学术研究课题、论文分类检索模态框
│   │   └── projects/          # 开源工程与交互演示卡片
│   ├── seo/                   # 搜索引擎优化组件
│   │   ├── StructuredDataSEO.tsx      # Schema.org Person 结构化数据
│   │   └── GoogleAnalytics.tsx        # GA4 动态上报
│   └── ui/                    # 基础 UI 零件库（Button, Modal, Card, Badge）
├── hooks/                     # 复合自定义 Hook（视口检测、滚动监听等）
├── locales/                   # 国际化语言包（zh.json 与 en.json）
├── pages/                     # 路由顶层页面入口容器
├── routes/                    # 路由集中配置与私有权限守卫
├── styles/                    # 全局样式（Tailwind、无障碍增强、动画定义）
└── types/                     # 业务模型 TypeScript 类型定义
```

---

## 3. 设计系统与主题机制 (Design System & Theme)

### 3.1 主题色彩与原子化 Token
基于 Tailwind CSS 与 CSS Custom Properties 实现零闪烁主题切换：
- **亮色模式 (Light Mode)**: 高雅学术白蓝灰底色，主文本为冷调暗灰，保持高对比度阅览舒适性。
- **暗色模式 (Dark Mode)**: 深空灰背景与星空黑卡片底色，强调色使用青蓝与琥珀金强调科研与极客感。

### 3.2 暗色模式工作原理 (`DarkModeProvider`)
- **优先级策略**: 用户手动切换（写入 `localStorage`）> 浏览器操作系统主题偏好 (`window.matchMedia('(prefers-color-scheme: dark)')`)。
- **平滑过渡**: 通过 `<ThemeTransition>` 组件在 HTML 根节点注入 `.theme-transition` 类，平滑过渡背景与字体色彩，避免闪屏突兀。

---

## 4. 国际化多语言体系 (i18n Workflow)

### 4.1 核心机制
- 核心引擎采用 `react-i18next`。
- 字典定义在 `src/locales/zh.json` (中文) 与 `src/locales/en.json` (英文)。
- 组件通过统一 Hook 接入：
  ```tsx
  import { useTranslation } from './components/common/TranslationProvider';

  function ExampleComponent() {
    const { t, language, changeLanguage } = useTranslation();
    return <h1>{t('home.hero.title')}</h1>;
  }
  ```

### 4.2 键名命名规范 (Key Naming Convention)
采用扁平嵌套的模块化路径结构：
```text
<page_or_feature>.<section>.<element>
例如:
- home.hero.title           # 首页英雄区大标题
- research.publications.title # 科研页成果标题
- common.adminAuth.tokenPlaceholder # 公共管理弹窗提示
```

### 4.3 自动化校验门禁
为杜绝“漏填英文”或“中英文结构漂移”，工程配置了专用校验脚本：
```bash
npm run i18n:validate
```
该脚本会递归对比两份 JSON 的所有叶子节点路径，确保 2200+ 键值绝对一致。

---

## 5. 特色视觉与特效工程

### 5.1 ASCII 律动矩阵 (`TraeASCIIBackground.tsx`)
- **实现原理**: 基于 HTML5 Canvas 绘制动态流动的字符矩阵。
- **智能节流**: 监听窗口 Resize，动态计算列宽与行距；页面在后台失活时自动暂停帧渲染，防止无效占用 GPU 与电池能耗。

### 5.2 粒子场互动 (`ParticleField.tsx`)
- 支持鼠标悬停吸引/排斥力学反馈、粒子间连线与动态聚类。
- 在移动端或用户开启“减弱动效 (prefers-reduced-motion)”时自动降级或停止计算。

---

## 6. 前端性能与 Web Vitals 优化规范

1. **路由分割与首屏轻量化**:
   - `src/routes/routes.config.tsx` 中所有非首页组件一律使用 `React.lazy()` 懒加载。
   - 生产打包配置了专门的 Rollup 分块规则，核心 Vendor 独立缓存。
2. **图片懒加载 (`LazyImage.tsx`)**:
   - 必须为所有科研大图与个人图像配置 `LazyImage`。
   - 基于 `IntersectionObserver`，仅在进入视口前 100px 时触发图片实际加载，并在未完成时展示骨架占位。
3. **PWA 离线支持 (`vite-plugin-pwa`)**:
   - 自动生成 Service Worker，将字体、核心 JS/CSS 与重要矢量图标沉淀在 CacheStorage，离线依然可瞬时打开主页。
