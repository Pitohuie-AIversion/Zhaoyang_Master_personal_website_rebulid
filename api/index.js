// 必须在最顶部加载环境变量
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';

// 在开发调试且显式启用时配置本地代理，生产禁用
const USE_LOCAL_PROXY = process.env.NODE_ENV !== 'production' && process.env.USE_LOCAL_PROXY === 'true';
if (USE_LOCAL_PROXY) {
  const PROXY_HOST = '127.0.0.1';
  const PROXY_PORT = 59010;
  if (typeof process.env.HTTP_PROXY === 'undefined') {
    process.env.HTTP_PROXY = `http://${PROXY_HOST}:${PROXY_PORT}`;
    process.env.HTTPS_PROXY = `http://${PROXY_HOST}:${PROXY_PORT}`;
    process.env.http_proxy = `http://${PROXY_HOST}:${PROXY_PORT}`;
    process.env.https_proxy = `http://${PROXY_HOST}:${PROXY_PORT}`;
    console.log('🌐 Local proxy configured:', process.env.HTTP_PROXY);
  }
  try {
    const { HttpsProxyAgent } = await import('https-proxy-agent');
    const agent = new HttpsProxyAgent(`http://${PROXY_HOST}:${PROXY_PORT}`);
    http.globalAgent = agent;
    https.globalAgent = agent;
    console.log('✅ HTTPS proxy agent configured (dev)');
  } catch (error) {
    console.log('⚠️ HttpsProxyAgent not available, skipping proxy agent');
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 尝试从项目根目录加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// 如果上述路径失败，尝试从当前工作目录加载
if (!process.env.VITE_SUPABASE_URL) {
  dotenv.config();
  console.log('Fallback to current directory for .env file');
}

// 确保环境变量加载完成后再继续
console.log('Environment variables loaded:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'MISSING');

import express from 'express';
import cors from 'cors';
import { securityLogger, securityHeaders } from './services/combined.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件 - 必须在其他中间件之前
app.use(securityLogger); // 安全日志和威胁检测
app.use(securityHeaders); // 安全响应头

// 中间件配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://zhaoyangmu.cloud', 'https://www.zhaoyangmu.cloud'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the resume directory
app.use('/resume', express.static(path.join(process.cwd(), 'resume')));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 使用超级合并的路由文件以减少函数数量
const allRoutes = await import('./routes/all-routes-combined.js').then(m => m.default);

// API路由 - 全部使用单一合并路由文件
app.use('/api', allRoutes);

// 404处理
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.path 
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 启动服务器
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default (req, res) => app(req, res);
