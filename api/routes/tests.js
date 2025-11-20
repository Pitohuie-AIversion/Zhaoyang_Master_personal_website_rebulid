import express from 'express';
import { testGPT4Endpoint } from './test-gpt4.js';
import { testGPT4ProxyEndpoint } from './test-gpt4-proxy.js';
import { testGPT4MockEndpoint } from './test-gpt4-mock.js';
import { testGPT35Endpoint } from './test-gpt35.js';
import { testSecurityEndpoint } from './test-security.js';
import { checkOpenAiStatus } from './check-openai-status.js';
import { checkApiStatus } from './check-api-status.js';

const router = express.Router();

// GPT-4 测试端点
router.post('/gpt4', testGPT4Endpoint);
router.post('/gpt4-proxy', testGPT4ProxyEndpoint);
router.post('/gpt4-mock', testGPT4MockEndpoint);

// GPT-3.5 测试端点
router.post('/gpt35', testGPT35Endpoint);

// 安全测试端点
router.get('/security', testSecurityEndpoint);

// 状态检查端点
router.get('/openai-status', checkOpenAiStatus);
router.get('/api-status', checkApiStatus);

export default router;