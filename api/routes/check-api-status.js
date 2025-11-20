import express from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';

const router = express.Router();

// 测试 API 密钥状态的路由
export const checkApiStatus = async (req, res) => {
  try {
    console.log('🔍 Testing OpenAI API key status...');
    
    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:59010');
    
    // 测试 API 密钥
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      agent: proxyAgent
    });

    console.log('📊 API Response Status:', response.status);
    
    if (response.status === 200) {
      const data = await response.json();
      const gptModels = data.data.filter(model => 
        model.id.includes('gpt-4') || model.id.includes('gpt-3.5')
      );
      
      res.json({
        status: 'success',
        message: 'API key is valid and working',
        available_models: gptModels.map(m => m.id),
        total_models: data.data.length,
        timestamp: new Date().toISOString()
      });
    } else if (response.status === 401) {
      res.json({
        status: 'error',
        message: 'Invalid API key',
        suggestion: 'Please check your OpenAI API key'
      });
    } else if (response.status === 429) {
      const errorData = await response.text();
      res.json({
        status: 'quota_exceeded',
        message: 'API quota exceeded',
        details: 'Your account has exceeded the current quota',
        suggestion: 'Please check your OpenAI dashboard for usage details',
        dashboard_url: 'https://platform.openai.com/account/usage'
      });
    } else {
      const errorData = await response.text();
      res.json({
        status: 'error',
        message: `API error: ${response.status}`,
        details: errorData
      });
    }

  } catch (error) {
    console.error('❌ API key test failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to test API key',
      details: error.message,
      suggestion: 'Please check your VPN connection'
    });
  }
};

// 保持向后兼容性
router.post('/', checkApiStatus);
export default router;
