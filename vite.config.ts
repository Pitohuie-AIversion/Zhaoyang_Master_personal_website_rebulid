import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库分离到单独的chunk
          'react-vendor': ['react', 'react-dom'],
          // 将路由相关库分离
          'router': ['react-router-dom'],
          // 将UI组件库分离
          'ui': ['lucide-react'],
          // 将SEO相关库分离
          'seo': ['react-helmet-async'],
          // 新增：动画库分离
          'motion': ['framer-motion'],
          // 新增：图表库分离
          'charts': ['recharts'],
          // 新增：工具库分离
          'utils': ['clsx', 'tailwind-merge']
        },
        // 优化chunk文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 500,
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    // 新增：启用构建分析
    reportCompressedSize: true,
    // 新增：启用sourcemap
    sourcemap: true
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'react-helmet-async',
      'framer-motion',
      'recharts',
      'clsx',
      'tailwind-merge'
    ]
  },
  // 开发服务器配置
  server: {
    // 启用HTTP/2
    https: false,
    // 代理配置，将/api请求转发到后端
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    },
    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/components/**/*.tsx',
        './src/pages/**/*.tsx'
      ]
    }
  }
})
