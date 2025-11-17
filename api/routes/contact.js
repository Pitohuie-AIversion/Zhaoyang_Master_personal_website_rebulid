import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

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

// 获取所有联系信息（支持分页和筛选）
router.get('/messages', async (req, res) => {
  try {
    // 检查Supabase客户端是否可用
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized. Please check server configuration.',
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        }
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = supabase
      .from('contact_messages')
      .select('*');
    
    // 搜索筛选
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`);
    }
    
    // 状态筛选
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // 排序
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // 获取总数
    const { count, error: countError } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // 获取分页数据
    const { data: messages, error } = await query
      .range(offset, offset + parseInt(limit) - 1);
    
    if (error) throw error;
    
    res.json({
      data: messages || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      },
      filters: { search, status, sortBy, sortOrder }
    });
    
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contact messages',
      details: error.message
    });
  }
});

// 获取单个联系信息详情
router.get('/messages/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized. Please check server configuration.'
      });
    }

    const { id } = req.params;
    
    const { data: message, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Message not found',
          details: 'The requested contact message does not exist'
        });
      }
      throw error;
    }
    
    res.json({
      data: message
    });
    
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contact message',
      details: error.message
    });
  }
});

// 更新联系信息状态
router.patch('/messages/:id/status', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized. Please check server configuration.'
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    
    // 验证状态值
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        details: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Message not found',
          details: 'The requested contact message does not exist'
        });
      }
      throw error;
    }
    
    res.json({
      data: message,
      message: `Message status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Update contact message status error:', error);
    res.status(500).json({
      error: 'Failed to update contact message status',
      details: error.message
    });
  }
});

// 获取联系信息统计
router.get('/stats', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized. Please check server configuration.'
      });
    }

    // 获取各种状态的统计
    const { data: allMessages, error } = await supabase
      .from('contact_messages')
      .select('status, created_at');
    
    if (error) throw error;
    
    // 计算统计信息
    const stats = {
      total: allMessages.length,
      byStatus: {
        new: allMessages.filter(msg => msg.status === 'new').length,
        read: allMessages.filter(msg => msg.status === 'read').length,
        replied: allMessages.filter(msg => msg.status === 'replied').length,
        archived: allMessages.filter(msg => msg.status === 'archived').length
      },
      recentCount: allMessages.filter(msg => {
        const createdDate = new Date(msg.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      }).length
    };
    
    res.json({
      stats,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve contact statistics',
      details: error.message
    });
  }
});

// 删除联系信息
router.delete('/messages/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized. Please check server configuration.'
      });
    }

    const { id } = req.params;
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Message not found',
          details: 'The requested contact message does not exist'
        });
      }
      throw error;
    }
    
    res.json({
      message: 'Contact message deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      error: 'Failed to delete contact message',
      details: error.message
    });
  }
});

export default router;