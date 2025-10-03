# 牟昭阳个人网站 | Zhaoyang Mu Personal Website

基于 React + TypeScript + Vite 构建的个人网站，展示个人简历、项目作品、学术成果等内容。

**Last Updated**: 2025-01-27 - Auto-deployment test

## 🌐 部署信息

- **生产环境**: [https://zhaoyangmu.cloud](https://zhaoyangmu.cloud)
- **绑定域名**: zhaoyangmu.cloud
- **部署平台**: Vercel

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **样式方案**: Tailwind CSS
- **动画库**: Framer Motion
- **路由**: React Router DOM
- **国际化**: 自定义 i18n 解决方案
- **部署**: Vercel

## 📦 开发配置

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
