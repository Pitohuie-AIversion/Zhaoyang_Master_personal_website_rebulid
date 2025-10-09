import express from 'express';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 初始化Supabase客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 速率限制中间件
const chatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 30, // 每15分钟最多30次请求
  message: {
    error: 'Too many chat requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 知识库内容（基于网站信息）
const knowledgeBase = {
  zh: {
    personal: {
      name: '牟昭阳',
      title: '人工智能专业硕士研究生',
      university: '大连海事大学',
      visitingStudent: '西湖大学工学院i⁴-FSI实验室访问学生',
      advisor: '徐敏义教授',
      visitingPI: '范迪夏教授',
      location: '大连市甘井子区凌海路1号',
      email: 'muzhaoyang@dlmu.edu.cn',
      phone: '+86 159-4095-5159'
    },
    research: {
      areas: ['科学计算', '机器人技术', 'CFD时空场建模', 'Transformer', 'Neural Operator'],
      focus: '使用Transformer和Neural Operator建模CFD时空场',
      contributions: ['溃坝流动预测', '稀疏到稠密场重构', 'DamFormer系统开发']
    },
    projects: [
      {
        name: 'DamFormer溃坝流动预测系统',
        description: '基于Transformer的CFD时空场预测模型',
        tech: ['Python', 'PyTorch', 'CFD仿真']
      },
      {
        name: 'Rs-ModCubes模块化机器人',
        description: '可重构模块化机器人系统',
        tech: ['STM32', '硬件控制', '机器人技术']
      },
      {
        name: '仿生波动鳍推进系统',
        description: '仿生鱼类推进机制的工程实现',
        tech: ['机械设计', '控制系统', '仿生学']
      }
    ],
    skills: {
      programming: ['Python', 'MATLAB', 'C++', 'Java', 'JavaScript'],
      simulation: ['Star-CCM+', 'ANSYS Fluent', 'OpenFOAM'],
      ml: ['PyTorch', 'TensorFlow', 'Transformer'],
      hardware: ['STM32', 'Arduino', '传感器集成'],
      server: ['Linux', 'HPC集群管理']
    }
  },
  en: {
    personal: {
      name: 'Zhaoyang Mu',
      title: 'Master\'s Student in Artificial Intelligence',
      university: 'Dalian Maritime University',
      visitingStudent: 'Visiting Student at i⁴-FSI Laboratory, School of Engineering, Westlake University',
      advisor: 'Prof. Xu Minyi',
      visitingPI: 'Prof. Fan Dixia',
      location: 'No.1 Linghai Road, Ganjingzi District, Dalian',
      email: 'muzhaoyang@dlmu.edu.cn',
      phone: '+86 159-4095-5159'
    },
    research: {
      areas: ['Scientific Computing', 'Robotics', 'CFD Spatiotemporal Field Modeling', 'Transformer', 'Neural Operator'],
      focus: 'Using Transformer and Neural Operator for CFD spatiotemporal field modeling',
      contributions: ['Dam-break flow prediction', 'Sparse-to-dense field reconstruction', 'DamFormer system development']
    },
    projects: [
      {
        name: 'DamFormer Dam-break Flow Prediction System',
        description: 'Transformer-based CFD spatiotemporal field prediction model',
        tech: ['Python', 'PyTorch', 'CFD Simulation']
      },
      {
        name: 'Rs-ModCubes Modular Robots',
        description: 'Reconfigurable modular robot system',
        tech: ['STM32', 'Hardware Control', 'Robotics']
      },
      {
        name: 'Bionic Undulating Fin Propulsion System',
        description: 'Engineering implementation of bionic fish propulsion mechanism',
        tech: ['Mechanical Design', 'Control System', 'Bionics']
      }
    ],
    skills: {
      programming: ['Python', 'MATLAB', 'C++', 'Java', 'JavaScript'],
      simulation: ['Star-CCM+', 'ANSYS Fluent', 'OpenFOAM'],
      ml: ['PyTorch', 'TensorFlow', 'Transformer'],
      hardware: ['STM32', 'Arduino', 'Sensor Integration'],
      server: ['Linux', 'HPC Cluster Management']
    }
  }
};

// 生成系统提示词
function generateSystemPrompt(language = 'zh') {
  const kb = knowledgeBase[language];
  
  return `你是牟昭阳的智能助手，专门为访问者介绍他的学术背景、研究项目和专业技能。

个人信息：
- 姓名：${kb.personal.name}
- 身份：${kb.personal.title}
- 学校：${kb.personal.university}
- 访问学生：${kb.personal.visitingStudent}
- 导师：${kb.personal.advisor}
- 访问PI：${kb.personal.visitingPI}
- 联系方式：${kb.personal.email}, ${kb.personal.phone}

研究方向：
- 主要领域：${kb.research.areas.join('、')}
- 研究重点：${kb.research.focus}
- 主要贡献：${kb.research.contributions.join('、')}

主要项目：
${kb.projects.map(p => `- ${p.name}：${p.description}（技术栈：${p.tech.join('、')}）`).join('\n')}

技能专长：
- 编程语言：${kb.skills.programming.join('、')}
- 仿真软件：${kb.skills.simulation.join('、')}
- 机器学习：${kb.skills.ml.join('、')}
- 硬件开发：${kb.skills.hardware.join('、')}
- 服务器管理：${kb.skills.server.join('、')}

请以友好、专业的语气回答用户问题，重点介绍牟昭阳的学术成就和技术能力。如果用户询问的内容超出了提供的信息范围，请礼貌地说明并引导用户询问相关的学术或技术问题。

回答要求：
1. 使用${language === 'zh' ? '中文' : '英文'}回答
2. 保持专业但友好的语气
3. 提供准确、有用的信息
4. 适当时提供相关链接建议
5. 回答长度控制在200字以内`;
}

// 发送消息接口
router.post('/message', chatRateLimit, async (req, res) => {
  try {
    const { message, sessionId, language = 'zh', context = [] } = req.body;

    // 验证输入
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string' 
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        error: 'Message too long. Maximum 1000 characters allowed.' 
      });
    }

    // 生成会话ID（如果没有提供）
    const finalSessionId = sessionId || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 保存用户消息到数据库
    const { error: saveUserError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: finalSessionId,
        content: message.trim(),
        message_type: 'user',
        metadata: { language: language }
      });

    if (saveUserError) {
      console.error('Error saving user message:', saveUserError);
    }

    // 构建对话历史
    const messages = [
      {
        role: 'system',
        content: generateSystemPrompt(language)
      },
      ...context.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      })),
      {
        role: 'user',
        content: message.trim()
      }
    ];

    // 调用OpenAI API（带重试机制）
    let completion;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
          timeout: 60000 // 60秒超时
        });
        break; // 成功则跳出循环
      } catch (openaiError) {
        retryCount++;
        console.error(`OpenAI API error (attempt ${retryCount}/${maxRetries}):`, openaiError);
        
        // 如果是网络连接错误且还有重试次数
        if ((openaiError.code === 'ECONNRESET' || openaiError.code === 'ETIMEDOUT' || openaiError.type === 'system') && retryCount < maxRetries) {
          console.log(`Retrying in ${retryCount * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryCount * 2000)); // 递增延迟
          continue;
        }
        
        // 如果重试次数用完或其他错误，返回友好的错误信息
        if (retryCount >= maxRetries || openaiError.code === 'ECONNRESET' || openaiError.code === 'ETIMEDOUT' || openaiError.type === 'system') {
          return res.status(503).json({
            error: 'AI service is temporarily unavailable. Please try again in a moment.',
            code: 'service_unavailable',
            details: `Failed after ${retryCount} attempts`
          });
        }
        
        throw openaiError; // 重新抛出其他错误
      }
    }

    const reply = completion.choices[0]?.message?.content || '抱歉，我现在无法回答您的问题。请稍后再试。';

    // 生成相关链接
    const relatedLinks = generateRelatedLinks(message, language);

    // 保存助手回复到数据库
    const { error: saveAssistantError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: finalSessionId,
        content: reply,
        message_type: 'assistant',
        metadata: { 
          language: language,
          related_links: relatedLinks
        }
      });

    if (saveAssistantError) {
      console.error('Error saving assistant message:', saveAssistantError);
    }

    // 记录知识库查询
    const { error: knowledgeError } = await supabase
      .from('knowledge_queries')
      .insert({
        session_id: finalSessionId,
        query_text: message.trim(),
        search_results: [{ response: reply, relevance_score: 1.0 }],
        relevance_score: 1.0
      });

    if (knowledgeError) {
      console.error('Error saving knowledge query:', knowledgeError);
    }

    res.json({
      reply,
      relatedLinks,
      sessionId: finalSessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error stack:', error.stack);
    
    // 记录详细的错误信息
    const errorDetails = {
      message: error.message,
      code: error.code,
      type: error.type,
      status: error.status,
      timestamp: new Date().toISOString(),
      sessionId: finalSessionId || 'unknown'
    };
    console.error('Detailed error info:', JSON.stringify(errorDetails, null, 2));
    
    // 如果是OpenAI API错误，提供更具体的错误信息
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'AI service temporarily unavailable due to quota limits. Please try again later.',
        code: 'service_unavailable',
        details: 'quota_exceeded'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment and try again.',
        code: 'rate_limit',
        details: 'rate_limit_exceeded'
      });
    }

    // 数据库连接错误
    if (error.message && error.message.includes('database')) {
      return res.status(503).json({
        error: 'Database service temporarily unavailable. Please try again later.',
        code: 'database_error',
        details: 'database_connection_failed'
      });
    }

    // 网络连接错误
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.type === 'system') {
      return res.status(503).json({
        error: 'Network connection error. Please check your internet connection and try again.',
        code: 'network_error',
        details: error.code || 'connection_failed'
      });
    }

    // 通用服务器错误
    res.status(500).json({
      error: 'An unexpected error occurred while processing your message. Please try again.',
      code: 'internal_error',
      details: 'server_error',
      timestamp: new Date().toISOString()
    });
  }
});

// 生成相关链接
function generateRelatedLinks(message, language) {
  const lowerMessage = message.toLowerCase();
  const links = [];
  
  const linkMap = {
    zh: {
      research: { title: '研究页面', url: '/research' },
      projects: { title: '项目展示', url: '/projects' },
      publications: { title: '学术论文', url: '/publications' },
      contact: { title: '联系方式', url: '/contact' },
      skills: { title: '技能专长', url: '/skills' },
      home: { title: '个人主页', url: '/' }
    },
    en: {
      research: { title: 'Research', url: '/research' },
      projects: { title: 'Projects', url: '/projects' },
      publications: { title: 'Publications', url: '/publications' },
      contact: { title: 'Contact', url: '/contact' },
      skills: { title: 'Skills', url: '/skills' },
      home: { title: 'Home', url: '/' }
    }
  };
  
  const currentLinks = linkMap[language] || linkMap.zh;
  
  if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
    links.push(currentLinks.research);
  }
  
  if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
    links.push(currentLinks.projects);
  }
  
  if (lowerMessage.includes('论文') || lowerMessage.includes('publication')) {
    links.push(currentLinks.publications);
  }
  
  if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
    links.push(currentLinks.contact);
  }
  
  if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
    links.push(currentLinks.skills);
  }
  
  // 如果没有匹配到特定链接，返回主页
  if (links.length === 0) {
    links.push(currentLinks.home);
  }
  
  return links.slice(0, 3); // 最多返回3个链接
}

// 查询分类
function categorizeQuery(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
    return 'research';
  }
  if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
    return 'projects';
  }
  if (lowerMessage.includes('教育') || lowerMessage.includes('education')) {
    return 'education';
  }
  if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
    return 'skills';
  }
  if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
    return 'contact';
  }
  
  return 'general';
}

// 获取聊天历史
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(parseInt(limit));

    if (error) {
      throw error;
    }

    res.json({
      messages: data || [],
      sessionId
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve chat history'
    });
  }
});

export default router;