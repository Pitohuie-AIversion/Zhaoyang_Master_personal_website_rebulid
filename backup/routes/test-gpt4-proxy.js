import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// 使用 fetch 直接调用 OpenAI API 的测试路由
export const testGPT4ProxyEndpoint = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = language === 'zh' 
      ? '你是牟昭阳的智能学术助手。请用中文回答关于他的研究、项目和技能的问题。'
      : 'You are Zhaoyang Mu\'s intelligent academic assistant. Please answer questions about his research, projects, and skills in English.';

    console.log('🤖 Calling OpenAI GPT-4 API using fetch...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7
      }),
      timeout: 30000
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content;
    
    console.log('✅ GPT-4 response received successfully');
    console.log('Response length:', reply?.length || 0, 'characters');

    res.json({
      reply,
      model: 'gpt-4o-mini',
      timestamp: new Date().toISOString(),
      success: true
    });

  } catch (error) {
    console.error('❌ GPT-4 test failed:', error.message);
    console.error('Error details:', error);
    
    res.status(500).json({
      error: 'GPT-4 API call failed',
      details: error.message,
      suggestion: 'Please check your VPN connection and OpenAI API key'
    });
  }
});

// 保持向后兼容性
router.post('/', testGPT4ProxyEndpoint);

export default router;