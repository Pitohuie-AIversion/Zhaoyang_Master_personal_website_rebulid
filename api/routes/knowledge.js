import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// 初始化Supabase客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 搜索知识库
router.get('/search', async (req, res) => {
  try {
    const { 
      query, 
      language = 'zh', 
      type, 
      limit = 10,
      offset = 0 
    } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    let supabaseQuery = supabase
      .from('knowledge_queries')
      .select('*')
      .ilike('query', `%${query.trim()}%`)
      .eq('language', language)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (type) {
      supabaseQuery = supabaseQuery.eq('query_type', type);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      throw error;
    }

    res.json({
      results: data || [],
      query: query.trim(),
      language,
      type,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: data?.length || 0
      }
    });

  } catch (error) {
    console.error('Knowledge search error:', error);
    res.status(500).json({
      error: 'Failed to search knowledge base'
    });
  }
});

// 获取热门查询
router.get('/popular', async (req, res) => {
  try {
    const { 
      language = 'zh', 
      limit = 10,
      days = 7 
    } = req.query;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const { data, error } = await supabase
      .from('knowledge_queries')
      .select('query, query_type, count(*)')
      .eq('language', language)
      .gte('created_at', cutoffDate.toISOString())
      .group('query, query_type')
      .order('count', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      throw error;
    }

    res.json({
      popularQueries: data || [],
      language,
      timeframe: `${days} days`,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get popular queries error:', error);
    res.status(500).json({
      error: 'Failed to retrieve popular queries'
    });
  }
});

// 获取查询统计
router.get('/stats', async (req, res) => {
  try {
    const { 
      language,
      startDate,
      endDate 
    } = req.query;

    let query = supabase
      .from('knowledge_queries')
      .select('query_type, language, created_at');

    if (language) {
      query = query.eq('language', language);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // 统计数据处理
    const stats = {
      total: data.length,
      byLanguage: {},
      byType: {},
      byDate: {},
      timeRange: {
        start: startDate || (data.length > 0 ? data[0].created_at : null),
        end: endDate || (data.length > 0 ? data[data.length - 1].created_at : null)
      }
    };

    data.forEach(item => {
      // 按语言统计
      stats.byLanguage[item.language] = (stats.byLanguage[item.language] || 0) + 1;
      
      // 按类型统计
      stats.byType[item.query_type] = (stats.byType[item.query_type] || 0) + 1;
      
      // 按日期统计
      const date = item.created_at.split('T')[0];
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });

    res.json(stats);

  } catch (error) {
    console.error('Get knowledge stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve knowledge statistics'
    });
  }
});

// 获取相关建议
router.get('/suggestions', async (req, res) => {
  try {
    const { 
      query, 
      language = 'zh',
      limit = 5 
    } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required for suggestions'
      });
    }

    // 基于查询内容生成建议
    const suggestions = generateSuggestions(query.trim(), language);
    
    // 从数据库中查找相似查询
    const { data, error } = await supabase
      .from('knowledge_queries')
      .select('query, query_type, response')
      .eq('language', language)
      .ilike('query', `%${query.trim().split(' ')[0]}%`)
      .limit(parseInt(limit));

    if (error) {
      console.error('Database query error:', error);
    }

    const dbSuggestions = data?.map(item => ({
      query: item.query,
      type: item.query_type,
      preview: item.response?.substring(0, 100) + '...'
    })) || [];

    res.json({
      suggestions: suggestions.slice(0, parseInt(limit)),
      relatedQueries: dbSuggestions,
      originalQuery: query.trim(),
      language
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      error: 'Failed to generate suggestions'
    });
  }
});

// 生成查询建议
function generateSuggestions(query, language) {
  const lowerQuery = query.toLowerCase();
  
  const suggestionMap = {
    zh: {
      research: [
        '牟昭阳的主要研究方向是什么？',
        '他在CFD领域有哪些贡献？',
        '关于Transformer在科学计算中的应用',
        'DamFormer项目的技术细节',
        '稀疏到稠密场重构的原理'
      ],
      projects: [
        '介绍一下Rs-ModCubes模块化机器人项目',
        '仿生波动鳍推进系统的工作原理',
        '风扇阵列风洞实验平台的设计',
        '海洋观测浮标系统的功能',
        '有哪些硬件控制项目？'
      ],
      education: [
        '牟昭阳的教育背景如何？',
        '他的导师是谁？',
        '在西湖大学的访问学习情况',
        '本科专业和研究生专业的关系',
        '学术成长经历'
      ],
      skills: [
        '他掌握哪些编程语言？',
        '在机器学习方面有什么经验？',
        'CFD仿真软件使用情况',
        '硬件开发能力如何？',
        '服务器和HPC管理经验'
      ],
      contact: [
        '如何联系牟昭阳？',
        '他的邮箱地址是什么？',
        '办公地址在哪里？',
        '有哪些社交媒体账号？',
        '如何进行学术合作？'
      ]
    },
    en: {
      research: [
        'What are Zhaoyang Mu\'s main research areas?',
        'What contributions has he made in CFD?',
        'About Transformer applications in scientific computing',
        'Technical details of the DamFormer project',
        'Principles of sparse-to-dense field reconstruction'
      ],
      projects: [
        'Tell me about the Rs-ModCubes modular robot project',
        'How does the bionic undulating fin propulsion system work?',
        'Design of the fan array wind tunnel platform',
        'Functions of the ocean observation buoy system',
        'What hardware control projects are there?'
      ],
      education: [
        'What is Zhaoyang Mu\'s educational background?',
        'Who are his advisors?',
        'About his visiting study at Westlake University',
        'Relationship between undergraduate and graduate majors',
        'Academic growth experience'
      ],
      skills: [
        'What programming languages does he master?',
        'What experience does he have in machine learning?',
        'CFD simulation software usage',
        'How are his hardware development capabilities?',
        'Server and HPC management experience'
      ],
      contact: [
        'How to contact Zhaoyang Mu?',
        'What is his email address?',
        'Where is his office located?',
        'What social media accounts does he have?',
        'How to collaborate academically?'
      ]
    }
  };

  const suggestions = suggestionMap[language] || suggestionMap.zh;
  
  // 根据查询内容匹配相关建议
  if (lowerQuery.includes('研究') || lowerQuery.includes('research')) {
    return suggestions.research;
  }
  if (lowerQuery.includes('项目') || lowerQuery.includes('project')) {
    return suggestions.projects;
  }
  if (lowerQuery.includes('教育') || lowerQuery.includes('education')) {
    return suggestions.education;
  }
  if (lowerQuery.includes('技能') || lowerQuery.includes('skill')) {
    return suggestions.skills;
  }
  if (lowerQuery.includes('联系') || lowerQuery.includes('contact')) {
    return suggestions.contact;
  }
  
  // 默认返回研究相关建议
  return suggestions.research;
}

// 记录查询反馈
router.post('/feedback', async (req, res) => {
  try {
    const { 
      queryId, 
      sessionId, 
      rating, 
      feedback, 
      helpful 
    } = req.body;

    if (!queryId || !sessionId) {
      return res.status(400).json({
        error: 'Query ID and Session ID are required'
      });
    }

    // 更新知识库查询记录
    const { error } = await supabase
      .from('knowledge_queries')
      .update({
        feedback_rating: rating,
        feedback_text: feedback,
        is_helpful: helpful,
        updated_at: new Date().toISOString()
      })
      .eq('id', queryId)
      .eq('session_id', sessionId);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Feedback recorded successfully',
      queryId,
      sessionId
    });

  } catch (error) {
    console.error('Record feedback error:', error);
    res.status(500).json({
      error: 'Failed to record feedback'
    });
  }
});

export default router;