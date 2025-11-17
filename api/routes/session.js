import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// 初始化Supabase客户端
let supabase = null;
try {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Session Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Session Supabase client:', error.message);
}

// 创建新会话
router.post('/create', async (req, res) => {
  try {
    const { language = 'zh', userAgent, ipAddress } = req.body;
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized'
      });
    }
    
    // 生成会话ID
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建会话记录
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        session_id: sessionId,
        language: language,
        user_agent: userAgent,
        ip_address: ipAddress,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      sessionId,
      createdAt: data.created_at,
      language: data.language
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      error: 'Failed to create session'
    });
  }
});

// 获取会话信息
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized'
      });
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Session not found'
        });
      }
      throw error;
    }

    res.json({
      sessionId: data.session_id,
      language: data.language,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      messageCount: data.message_count || 0
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      error: 'Failed to retrieve session'
    });
  }
});

// 更新会话状态
router.patch('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, language } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (language) updateData.language = language;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('chat_sessions')
      .update(updateData)
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Session not found'
        });
      }
      throw error;
    }

    res.json({
      sessionId: data.session_id,
      status: data.status,
      language: data.language,
      updatedAt: data.updated_at
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      error: 'Failed to update session'
    });
  }
});

// 删除会话（软删除）
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Session deleted successfully',
      sessionId
    });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      error: 'Failed to delete session'
    });
  }
});

// 获取会话统计信息
router.get('/:sessionId/stats', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 获取消息统计
    const { data: messageStats, error: messageError } = await supabase
      .from('chat_messages')
      .select('sender, created_at')
      .eq('session_id', sessionId);

    if (messageError) {
      throw messageError;
    }

    // 获取知识库查询统计
    const { data: knowledgeStats, error: knowledgeError } = await supabase
      .from('knowledge_queries')
      .select('query_type, created_at')
      .eq('session_id', sessionId);

    if (knowledgeError) {
      throw knowledgeError;
    }

    // 计算统计数据
    const userMessages = messageStats.filter(m => m.sender === 'user').length;
    const assistantMessages = messageStats.filter(m => m.sender === 'assistant').length;
    
    const queryTypes = knowledgeStats.reduce((acc, q) => {
      acc[q.query_type] = (acc[q.query_type] || 0) + 1;
      return acc;
    }, {});

    const firstMessage = messageStats.length > 0 
      ? new Date(Math.min(...messageStats.map(m => new Date(m.created_at))))
      : null;
    
    const lastMessage = messageStats.length > 0
      ? new Date(Math.max(...messageStats.map(m => new Date(m.created_at))))
      : null;

    res.json({
      sessionId,
      messageCount: {
        total: messageStats.length,
        user: userMessages,
        assistant: assistantMessages
      },
      queryTypes,
      timeline: {
        firstMessage: firstMessage?.toISOString(),
        lastMessage: lastMessage?.toISOString(),
        duration: firstMessage && lastMessage 
          ? Math.round((lastMessage - firstMessage) / 1000) // 秒
          : 0
      }
    });

  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve session statistics'
    });
  }
});

// 清理过期会话（可以通过定时任务调用）
router.post('/cleanup', async (req, res) => {
  try {
    const { daysOld = 30 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .lt('created_at', cutoffDate.toISOString())
      .eq('status', 'active')
      .select('session_id');

    if (error) {
      throw error;
    }

    res.json({
      message: `Cleaned up ${data.length} expired sessions`,
      expiredSessions: data.length,
      cutoffDate: cutoffDate.toISOString()
    });

  } catch (error) {
    console.error('Cleanup sessions error:', error);
    res.status(500).json({
      error: 'Failed to cleanup expired sessions'
    });
  }
});

export default router;