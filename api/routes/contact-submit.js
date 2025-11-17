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

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 提交联系表单 - 应用限流保护
router.post('/submit', contactRateLimit, async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
      phone,
      company,
      collaboration_type,
      budget,
      timeline,
      status = 'new'
    } = req.body;

    // 基本验证
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: '缺少必填字段：姓名、邮箱、主题和消息内容都是必填的' 
      });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: '请输入有效的邮箱地址' 
      });
    }

    // 准备数据
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
      collaboration_type: collaboration_type || null,
      budget: budget || null,
      timeline: timeline || null,
      status: status,
      ip_address: req.ip || req.connection?.remoteAddress || 'unknown',
      user_agent: req.get('User-Agent') || 'unknown',
      referrer: req.get('Referer') || 'unknown'
    };

    // 插入数据到 Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // 检查是否是权限错误
      if (error.code === '42501') {
        return res.status(403).json({ 
          error: '权限错误：无法保存联系信息，请联系管理员' 
        });
      }
      
      return res.status(500).json({ 
        error: '保存联系信息失败，请稍后重试',
        details: error.message 
      });
    }

    // 返回成功响应
    res.status(201).json({
      success: true,
      message: '联系信息已成功保存',
      data: data
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      error: '服务器内部错误，请稍后重试',
      details: error.message 
    });
  }
});

export default router;