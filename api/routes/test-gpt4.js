import express from 'express';
import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

const router = express.Router();

// 直接测试GPT-3.5 Turbo的简单路由
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 直接使用OpenAI API密钥（简化测试）
    const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:59010');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
      maxRetries: 2,
      baseURL: 'https://api.openai.com/v1',
      defaultHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      httpAgent: proxyAgent,
      httpsAgent: proxyAgent
    });

    const systemPrompt = language === 'zh' 
      ? '你是牟昭阳的智能学术助手。请用中文回答关于他的研究、项目和技能的问题。'
      : 'You are Zhaoyang Mu\'s intelligent academic assistant. Please answer questions about his research, projects, and skills in English.';

    console.log('🤖 Calling OpenAI GPT-3.5 Turbo API...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content;
    
    console.log('✅ GPT-3.5 Turbo response received successfully');
    console.log('Response length:', reply?.length || 0, 'characters');

    res.json({
      reply,
      model: 'gpt-3.5-turbo',
      timestamp: new Date().toISOString(),
      success: true
    });

  } catch (error) {
    console.error('❌ GPT-3.5 Turbo test failed:', error.message);
    console.error('Error details:', error);
    
    res.status(500).json({
      error: 'GPT-3.5 Turbo API call failed',
      details: error.message,
      suggestion: 'Please check your VPN connection and OpenAI API key'
    });
  }
});

export default router;