import express from 'express';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// 联系表单限流配置
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10, // 每IP最多10次提交
  message: {
    error: 'Too many contact requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 初始化Supabase客户端
let supabase = null;
try {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Contact - Supabase URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.log('Contact - Supabase Key:', supabaseKey ? 'SET' : 'MISSING');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables');
  }
  
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Contact Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Contact Supabase client:', error.message);
}

// 提交联系表单 - 应用限流保护
export const submitContact = async (req, res) => {
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
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name, email, and message are required'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      });
    }

    // 验证消息长度
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({
        error: 'Invalid message length',
        details: 'Message must be between 10 and 2000 characters'
      });
    }

    // 检查Supabase客户端是否可用
    if (!supabase) {
      return res.status(503).json({
        error: 'Database service unavailable',
        details: 'Contact service is temporarily unavailable'
      });
    }

    console.log('📧 Processing contact form submission...');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject || 'No subject');
    console.log('Category:', category);
    console.log('Language:', language);

    // 准备数据
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      category: category.toLowerCase(),
      language: language.toLowerCase(),
      status: 'new',
      created_at: new Date().toISOString(),
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('User-Agent') || 'unknown'
    };

    // 插入数据到数据库
    const { data, error } = await supabase
      .from('contact_forms')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('❌ Database insertion error:', error);
      throw error;
    }

    console.log('✅ Contact form submitted successfully');
    console.log('Contact ID:', data.id);

    // 返回成功响应
    res.status(201).json({
      success: true,
      message: language === 'zh' ? '感谢您的留言！我会尽快回复您。' : 'Thank you for your message! I will get back to you soon.',
      contact_id: data.id,
      timestamp: data.created_at
    });

  } catch (error) {
    console.error('❌ Contact form submission failed:', error);
    
    res.status(500).json({
      error: 'Failed to submit contact form',
      details: error.message || 'Internal server error',
      suggestion: 'Please try again later or contact me through other channels'
    });
  }
};

// 获取所有联系信息（支持分页和筛选）
export const getContactMessages = async (req, res) => {
  try {
    // 检查Supabase客户端是否可用
    if (!supabase) {
      return res.status(503).json({
        error: 'Database service unavailable',
        details: 'Contact service is temporarily unavailable'
      });
    }

    const { 
      page = 1, 
      limit = 50, 
      category = 'all', 
      status = 'all', 
      language = 'all',
      sort = 'desc' 
    } = req.query;

    // 验证分页参数
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50)); // 限制最大100条
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('contact_forms')
      .select('*', { count: 'exact' });

    // 应用筛选条件
    if (category !== 'all') {
      query = query.eq('category', category);
    }
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    if (language !== 'all') {
      query = query.eq('language', language);
    }

    // 应用排序
    query = sort === 'asc' ? query.order('created_at', { ascending: true }) : query.order('created_at', { ascending: false });

    // 应用分页
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Database query error:', error);
      throw error;
    }

    console.log(`✅ Retrieved ${data.length} contact messages`);

    // 返回响应
    res.json({
      messages: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      },
      filters: {
        category,
        status,
        language,
        sort
      }
    });

  } catch (error) {
    console.error('❌ Failed to retrieve contact messages:', error);
    
    res.status(500).json({
      error: 'Failed to retrieve contact messages',
      details: error.message || 'Internal server error'
    });
  }
};

// 路由挂载
router.post('/submit', contactRateLimit, submitContact);
router.get('/messages', getContactMessages);

export default router;