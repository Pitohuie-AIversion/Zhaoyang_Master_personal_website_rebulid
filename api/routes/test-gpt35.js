import express from 'express';
import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

const router = express.Router();

// 测试 GPT-3.5 Turbo 的简单路由
export const testGPT35Endpoint = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 Testing GPT-3.5 Turbo with message:', message.substring(0, 50) + '...');
    
    const systemPrompt = language === 'zh' 
      ? '你是牟昭阳的智能学术助手。请用中文回答关于他的研究、项目和技能的问题。'
      : 'You are Zhaoyang Mu\'s intelligent academic assistant. Please answer questions about his research, projects, and skills in English.';

    // 使用 fetch 直接调用 API，避免 SDK 限制
    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:59010');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      agent: proxyAgent,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log('❌ API Error:', response.status, errorData);
      
      // 如果是配额问题，提供详细信息
      if (response.status === 429) {
        return res.status(429).json({
          error: 'API quota exceeded',
          details: 'Your OpenAI API quota has been exceeded. This is normal for free tier accounts.',
          suggestion: 'Please check your OpenAI dashboard for usage details, or consider upgrading your plan.',
          dashboard_url: 'https://platform.openai.com/account/usage'
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content;
    
    console.log('✅ GPT-3.5 Turbo response received successfully');
    console.log('Response length:', reply?.length || 0, 'characters');

    res.json({
      reply,
      model: 'gpt-3.5-turbo',
      timestamp: new Date().toISOString(),
      success: true,
      note: 'Using GPT-3.5 Turbo to test API functionality'
    });

  } catch (error) {
    console.error('❌ GPT-3.5 Turbo test failed:', error.message);
    
    res.status(500).json({
      error: 'GPT-3.5 Turbo API call failed',
      details: error.message,
      suggestion: 'Please check your API quota and VPN connection'
    });
  }
};

// 保持向后兼容性
router.post('/', testGPT35Endpoint);
export default router;
