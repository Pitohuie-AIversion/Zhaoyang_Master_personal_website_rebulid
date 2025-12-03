/**
 * 超级合并路由文件 - 减少Vercel Serverless Functions数量
 * 包含所有API路由以符合Hobby计划的12个函数限制
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import multer from 'multer';
import { SecureKeyManager, utils } from '../utils/combined.js';

const router = express.Router();

// 全局初始化
let supabase = null;
let keyManager = null;
let openai = null;

// 初始化Supabase和密钥管理器
try {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    keyManager = new SecureKeyManager(supabase);
    console.log('✅ Global services initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize global services:', error.message);
}

// 初始化OpenAI客户端
async function initializeOpenAI() {
  if (openai) return openai;
  
  if (!keyManager) {
    console.log('⚠️ Key manager not available for OpenAI');
    return null;
  }

  try {
    const openaiKey = await keyManager.getApiKey('openai_api_key');
    if (openaiKey && openaiKey !== 'your-openai-api-key-here') {
      // 使用代理配置
      const { HttpsProxyAgent } = await import('https-proxy-agent');
      const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:59010');
      
      openai = new OpenAI({ 
        apiKey: openaiKey,
        timeout: 30000,
        maxRetries: 2,
        httpAgent: proxyAgent,
        httpsAgent: proxyAgent
      });
      console.log('✅ OpenAI client initialized successfully');
      return openai;
    }
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI:', error.message);
  }
  
  return null;
}

// 文件上传配置
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  }
});

// 限流配置
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

const chatRateLimit = createRateLimit(15 * 60 * 1000, 50, 'Too many chat requests, please try again later.');
const contactRateLimit = createRateLimit(15 * 60 * 1000, 10, 'Too many contact requests, please try again later.');
const uploadRateLimit = createRateLimit(15 * 60 * 1000, 20, 'Too many upload requests, please try again later.');

// ==================== 聊天路由 ====================

// 聊天完成接口
router.post('/chat/completions', chatRateLimit, async (req, res) => {
  try {
    const client = await initializeOpenAI();
    if (!client) {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    const { message, sessionId, context = '', language = 'en' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string',
        code: 'INVALID_MESSAGE'
      });
    }

    const systemPrompt = language === 'zh' 
      ? '你是一个 helpful AI assistant。请用中文回复，保持回答简洁专业。'
      : 'You are a helpful AI assistant. Please respond in English, keeping answers concise and professional.';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(context ? [{ role: 'user', content: context }] : []),
      { role: 'user', content: message.trim() }
    ];

    console.log(`🤖 Processing chat request (${language}):`, message.substring(0, 100) + '...');

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // 记录成功的API调用
    if (keyManager) {
      keyManager.updateKeyUsage('openai_api_key', 'chat/completions', 'POST', 200)
        .catch(err => console.error('Failed to update API usage:', err));
    }

    console.log(`✅ Chat response generated (${language}):`, response.substring(0, 100) + '...');

    res.json({
      response,
      sessionId,
      timestamp: new Date().toISOString(),
      usage: completion.usage
    });

  } catch (error) {
    console.error('❌ Chat completion error:', error.message);
    
    // 记录失败的API调用
    if (keyManager) {
      keyManager.updateKeyUsage('openai_api_key', 'chat/completions', 'POST', 500, null, error.message)
        .catch(err => console.error('Failed to update API usage:', err));
    }

    if (error.status === 401) {
      res.status(401).json({ 
        error: 'AI service authentication failed',
        code: 'AUTH_FAILED'
      });
    } else if (error.status === 429) {
      res.status(429).json({ 
        error: 'AI service rate limit exceeded',
        code: 'RATE_LIMITED'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to process chat request',
        code: 'INTERNAL_ERROR'
      });
    }
  }
});

// ==================== 联系表单路由 ====================

// 提交联系表单
router.post('/contact/submit', contactRateLimit, async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
      category = 'general',
      language = 'en'
    } = req.body;

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: language === 'zh' ? '请填写所有必填字段' : 'Please fill in all required fields',
        code: 'MISSING_FIELDS'
      });
    }

    // 验证邮箱格式
    if (!utils.validateEmail(email)) {
      return res.status(400).json({ 
        error: language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    // 验证消息长度
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({ 
        error: language === 'zh' ? '消息长度必须在10-2000字符之间' : 'Message must be between 10-2000 characters',
        code: 'INVALID_MESSAGE_LENGTH'
      });
    }

    if (!supabase) {
      return res.status(503).json({ 
        error: language === 'zh' ? '服务暂时不可用' : 'Service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    console.log(`📧 Processing contact form (${language}):`, { name, email, subject, category });

    // 插入联系数据
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        category: category,
        language: language,
        ip_address: utils.getClientIp(req),
        user_agent: req.get('User-Agent') || 'unknown',
        created_at: new Date().toISOString(),
        status: 'new'
      }]);

    if (error) {
      console.error('❌ Database insert error:', error);
      throw error;
    }

    console.log(`✅ Contact form submitted successfully (${language}):`, data);

    res.json({ 
      success: true,
      message: language === 'zh' 
        ? '您的消息已成功发送，我会尽快回复您！' 
        : 'Your message has been sent successfully, I will get back to you soon!',
      data: data
    });

  } catch (error) {
    console.error('❌ Contact form submission error:', error.message);
    
    const errorMessage = language === 'zh' 
      ? '提交失败，请稍后重试' 
      : 'Submission failed, please try again later';
    
    res.status(500).json({ 
      error: errorMessage,
      code: 'SUBMISSION_FAILED'
    });
  }
});

// 获取联系消息列表（简易分页）
router.get('/contact/messages', async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporarily unavailable', code: 'SERVICE_UNAVAILABLE' });
    }
    const from = (parseInt(page) - 1) * parseInt(pageSize);
    const to = from + parseInt(pageSize) - 1;
    const { data, error, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw error;
    res.json({ data, total: count || 0, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (error) {
    console.error('❌ Fetch contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts', code: 'FETCH_FAILED' });
  }
});

// 联系消息统计
router.get('/contact/stats', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporarily unavailable', code: 'SERVICE_UNAVAILABLE' });
    }
    const { data, error } = await supabase
      .from('contacts')
      .select('status');
    if (error) throw error;
    const byStatus = { new: 0, read: 0, replied: 0, archived: 0 };
    (data || []).forEach((row) => {
      const s = row.status;
      if (byStatus[s] !== undefined) byStatus[s]++;
    });
    const recentThreshold = new Date();
    recentThreshold.setDate(recentThreshold.getDate() - 30);
    const { data: recentData } = await supabase
      .from('contacts')
      .select('id, created_at')
      .gte('created_at', recentThreshold.toISOString());
    res.json({ stats: { total: (data || []).length, byStatus, recentCount: (recentData || []).length } });
  } catch (error) {
    console.error('❌ Contact stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', code: 'FETCH_FAILED' });
  }
});

// 更新联系消息状态
router.patch('/contact/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!supabase) {
      return res.status(503).json({ error: 'Service temporarily unavailable', code: 'SERVICE_UNAVAILABLE' });
    }
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status', code: 'INVALID_STATUS' });
    }
    const { data, error } = await supabase
      .from('contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Update contact status error:', error);
    res.status(500).json({ error: 'Failed to update status', code: 'UPDATE_FAILED' });
  }
});

// ==================== 文件上传路由 ====================

// 上传文件接口
router.post('/upload/file', uploadRateLimit, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        code: 'NO_FILE'
      });
    }

    const { category = 'general', language = 'en' } = req.body;
    const file = req.file;

    console.log(`📁 Processing file upload (${language}):`, {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      category
    });

    // 这里可以添加实际的文件处理逻辑，比如保存到云存储
    // 现在只是返回成功响应
    
    res.json({
      success: true,
      message: language === 'zh' ? '文件上传成功' : 'File uploaded successfully',
      file: {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        sizeFormatted: utils.formatFileSize(file.size)
      }
    });

  } catch (error) {
    console.error('❌ File upload error:', error.message);
    
    res.status(500).json({ 
      error: language === 'zh' ? '文件上传失败' : 'File upload failed',
      code: 'UPLOAD_FAILED'
    });
  }
});

// ==================== 学术内容路由 ====================

// 获取论文列表
router.get('/academics/publications', async (req, res) => {
  try {
    const { language = 'en', category = 'all', limit = 50 } = req.query;

    if (!supabase) {
      return res.status(503).json({ 
        error: 'Academic service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    console.log(`📚 Fetching publications (${language}):`, { category, limit });

    let query = supabase
      .from('publications')
      .select('*')
      .order('publication_date', { ascending: false })
      .limit(parseInt(limit));

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Publications fetch error:', error);
      throw error;
    }

    console.log(`✅ Publications fetched successfully:`, data?.length || 0);

    res.json({
      publications: data || [],
      count: data?.length || 0,
      language,
      category
    });

  } catch (error) {
    console.error('❌ Publications API error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to fetch publications',
      code: 'FETCH_FAILED'
    });
  }
});

// 获取项目列表
router.get('/academics/projects', async (req, res) => {
  try {
    const { language = 'en', category = 'all', limit = 50 } = req.query;

    if (!supabase) {
      return res.status(503).json({ 
        error: 'Project service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    console.log(`🔬 Fetching projects (${language}):`, { category, limit });

    let query = supabase
      .from('projects')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(parseInt(limit));

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Projects fetch error:', error);
      throw error;
    }

    console.log(`✅ Projects fetched successfully:`, data?.length || 0);

    res.json({
      projects: data || [],
      count: data?.length || 0,
      language,
      category
    });

  } catch (error) {
    console.error('❌ Projects API error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      code: 'FETCH_FAILED'
    });
  }
});

// ==================== 会话管理路由 ====================

// 创建会话
router.post('/session/create', async (req, res) => {
  try {
    const { type = 'chat', metadata = {}, language = 'en' } = req.body;

    if (!supabase) {
      return res.status(503).json({ 
        error: 'Session service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    const sessionId = utils.generateUUID();
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        session_id: sessionId,
        type: type,
        metadata: metadata,
        language: language,
        ip_address: utils.getClientIp(req),
        user_agent: req.get('User-Agent') || 'unknown',
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        status: 'active'
      }]);

    if (error) {
      console.error('❌ Session creation error:', error);
      throw error;
    }

    console.log(`✅ Session created successfully:`, sessionId);

    res.json({
      success: true,
      sessionId,
      message: language === 'zh' ? '会话创建成功' : 'Session created successfully'
    });

  } catch (error) {
    console.error('❌ Session creation API error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to create session',
      code: 'CREATE_FAILED'
    });
  }
});

// 更新会话活动
router.put('/session/:sessionId/activity', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { language = 'en' } = req.body;

    if (!supabase) {
      return res.status(503).json({ 
        error: 'Session service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    const { data, error } = await supabase
      .from('sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('session_id', sessionId);

    if (error) {
      console.error('❌ Session activity update error:', error);
      throw error;
    }

    res.json({
      success: true,
      message: language === 'zh' ? '会话活动已更新' : 'Session activity updated'
    });

  } catch (error) {
    console.error('❌ Session activity API error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to update session activity',
      code: 'UPDATE_FAILED'
    });
  }
});

// ==================== 知识库路由 ====================

// 搜索知识库
router.get('/knowledge/search', async (req, res) => {
  try {
    const { query, language = 'en', limit = 10 } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Search query is required',
        code: 'MISSING_QUERY'
      });
    }

    if (!supabase) {
      return res.status(503).json({ 
        error: 'Knowledge service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    console.log(`🔍 Searching knowledge base (${language}):`, query);

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.ilike.%${query}%`)
      .eq('language', language)
      .limit(parseInt(limit));

    if (error) {
      console.error('❌ Knowledge search error:', error);
      throw error;
    }

    console.log(`✅ Knowledge search completed:`, data?.length || 0);

    res.json({
      results: data || [],
      count: data?.length || 0,
      query,
      language
    });

  } catch (error) {
    console.error('❌ Knowledge search API error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to search knowledge base',
      code: 'SEARCH_FAILED'
    });
  }
});

// ==================== 简历路由 ====================

// 获取简历信息
router.get('/resume/info', async (req, res) => {
  try {
    const { language = 'en' } = req.query;

    if (!supabase) {
      return res.status(503).json({ 
        error: 'Resume service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    console.log(`📄 Fetching resume info (${language})`);

    const { data, error } = await supabase
      .from('resume_info')
      .select('*')
      .eq('language', language)
      .single();

    if (error) {
      console.error('❌ Resume info fetch error:', error);
      throw error;
    }

    console.log(`✅ Resume info fetched successfully`);

    res.json({
      resume: data,
      language
    });

  } catch (error) {
    console.error('❌ Resume info API error:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to fetch resume information',
      code: 'FETCH_FAILED'
    });
  }
});

// ==================== 测试路由 ====================

// 健康检查
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      supabase: supabase ? 'connected' : 'disconnected',
      openai: openai ? 'connected' : 'disconnected',
      keyManager: keyManager ? 'available' : 'unavailable'
    }
  });
});

// API状态检查
router.get('/status', (req, res) => {
  const status = {
    timestamp: new Date().toISOString(),
    services: {
      database: supabase ? 'connected' : 'disconnected',
      ai: openai ? 'connected' : 'disconnected',
      key_management: keyManager ? 'available' : 'unavailable'
    },
    environment: {
      node_env: process.env.NODE_ENV || 'development',
      has_supabase_url: !!process.env.VITE_SUPABASE_URL,
      has_supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      has_openai_key: !!process.env.OPENAI_API_KEY
    }
  };
  
  res.json(status);
});

export default router;
