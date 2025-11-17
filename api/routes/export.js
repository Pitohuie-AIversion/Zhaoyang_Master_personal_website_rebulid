import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// 初始化Supabase客户端
let supabase = null;
try {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Export Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Export Supabase client:', error.message);
}

// 导出所有学术数据
router.get('/academics', async (req, res) => {
  try {
    const { 
      format = 'json', 
      type = 'all', 
      language = 'zh',
      includeStats = 'true',
      dateFrom,
      dateTo 
    } = req.query;
    
    // 构建查询条件
    let dateFilter = {};
    if (dateFrom || dateTo) {
      const filter = {};
      if (dateFrom) filter.gte = dateFrom;
      if (dateTo) filter.lte = dateTo;
      dateFilter = filter;
    }
    
    const data = {
      exportInfo: {
        type,
        format,
        language,
        exportedAt: new Date().toISOString(),
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : null
      },
      data: {}
    };
    
    // 获取论文数据
    if (type === 'all' || type === 'publications') {
      let query = supabase.from('publications').select('*').order('year', { ascending: false });
      if (dateFrom || dateTo) {
        query = query.filter('created_at', 'gte', dateFrom || '2000-01-01')
                    .filter('created_at', 'lte', dateTo || '2099-12-31');
      }
      const { data: publications } = await query;
      data.data.publications = publications || [];
    }
    
    // 获取专利数据
    if (type === 'all' || type === 'patents') {
      let query = supabase.from('patents').select('*').order('public_date', { ascending: false });
      if (dateFrom || dateTo) {
        query = query.filter('created_at', 'gte', dateFrom || '2000-01-01')
                    .filter('created_at', 'lte', dateTo || '2099-12-31');
      }
      const { data: patents } = await query;
      data.data.patents = patents || [];
    }
    
    // 获取项目数据
    if (type === 'all' || type === 'projects') {
      let query = supabase.from('projects').select('*').order('year', { ascending: false });
      if (dateFrom || dateTo) {
        query = query.filter('created_at', 'gte', dateFrom || '2000-01-01')
                    .filter('created_at', 'lte', dateTo || '2099-12-31');
      }
      const { data: projects } = await query;
      data.data.projects = projects || [];
    }
    
    // 获取奖项数据
    if (type === 'all' || type === 'awards') {
      let query = supabase.from('awards').select('*').order('award_date', { ascending: false });
      if (dateFrom || dateTo) {
        query = query.filter('created_at', 'gte', dateFrom || '2000-01-01')
                    .filter('created_at', 'lte', dateTo || '2099-12-31');
      }
      const { data: awards } = await query;
      data.data.awards = awards || [];
    }
    
    // 获取统计数据
    if (includeStats === 'true') {
      data.statistics = await generateAcademicsStats(data.data);
    }
    
    // 设置文件名
    const filename = `academics_export_${type}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      // CSV格式导出
      const csvData = convertAcademicsToCSV(data);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData);
    } else if (format === 'xml') {
      // XML格式导出
      const xmlData = convertAcademicsToXML(data);
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xml"`);
      res.send(xmlData);
    } else {
      // JSON格式导出（默认）
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json(data);
    }
    
  } catch (error) {
    console.error('Export academics error:', error);
    res.status(500).json({
      error: 'Failed to export academic data',
      details: error.message
    });
  }
});

// 导出联系消息数据
router.get('/contacts', async (req, res) => {
  try {
    const { 
      format = 'json', 
      status = 'all',
      dateFrom,
      dateTo,
      includeSpam = 'false'
    } = req.query;
    
    // 构建查询条件
    let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (dateFrom || dateTo) {
      query = query.filter('created_at', 'gte', dateFrom || '2000-01-01')
                  .filter('created_at', 'lte', dateTo || '2099-12-31');
    }
    
    const { data: messages } = await query;
    
    const data = {
      exportInfo: {
        type: 'contact_messages',
        format,
        status,
        exportedAt: new Date().toISOString(),
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : null,
        totalRecords: messages?.length || 0
      },
      data: messages || []
    };
    
    // 生成统计信息
    if (messages && messages.length > 0) {
      data.statistics = {
        byStatus: {},
        byCollaborationType: {},
        byBudgetRange: {},
        monthlyTrend: {},
        recentContacts: messages.filter(m => {
          const createdDate = new Date(m.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }).length
      };
      
      messages.forEach(msg => {
        data.statistics.byStatus[msg.status] = (data.statistics.byStatus[msg.status] || 0) + 1;
        data.statistics.byCollaborationType[msg.collaboration_type] = (data.statistics.byCollaborationType[msg.collaboration_type] || 0) + 1;
        data.statistics.byBudgetRange[msg.budget_range] = (data.statistics.byBudgetRange[msg.budget_range] || 0) + 1;
        
        const monthKey = new Date(m.created_at).toISOString().substring(0, 7);
        data.statistics.monthlyTrend[monthKey] = (data.statistics.monthlyTrend[monthKey] || 0) + 1;
      });
    }
    
    const filename = `contact_export_${status}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      const csvData = convertContactsToCSV(data);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json(data);
    }
    
  } catch (error) {
    console.error('Export contacts error:', error);
    res.status(500).json({
      error: 'Failed to export contact data',
      details: error.message
    });
  }
});

// 导出聊天数据
router.get('/chats', async (req, res) => {
  try {
    const { 
      format = 'json', 
      sessionId,
      dateFrom,
      dateTo,
      includeAnalytics = 'true'
    } = req.query;
    
    let query = supabase.from('chat_messages').select('*').order('created_at', { ascending: false });
    
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    if (dateFrom || dateTo) {
      query = query.filter('created_at', 'gte', dateFrom || '2000-01-01')
                  .filter('created_at', 'lte', dateTo || '2099-12-31');
    }
    
    const { data: messages } = await query;
    
    const data = {
      exportInfo: {
        type: 'chat_messages',
        format,
        sessionId: sessionId || 'all',
        exportedAt: new Date().toISOString(),
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : null,
        totalRecords: messages?.length || 0
      },
      data: messages || []
    };
    
    // 生成分析数据
    if (includeAnalytics === 'true' && messages && messages.length > 0) {
      data.analytics = {
        byMessageType: {},
        byLanguage: {},
        hourlyDistribution: new Array(24).fill(0),
        dailyTrend: {},
        averageResponseTime: 0,
        totalUniqueSessions: new Set(messages.map(m => m.session_id)).size,
        topQueries: []
      };
      
      let totalResponseTime = 0;
      let responsePairs = 0;
      
      messages.forEach((msg, index) => {
        data.analytics.byMessageType[msg.message_type] = (data.analytics.byMessageType[msg.message_type] || 0) + 1;
        
        if (msg.metadata?.language) {
          data.analytics.byLanguage[msg.metadata.language] = (data.analytics.byLanguage[msg.metadata.language] || 0) + 1;
        }
        
        const hour = new Date(msg.created_at).getHours();
        data.analytics.hourlyDistribution[hour]++;
        
        const dateKey = new Date(msg.created_at).toISOString().split('T')[0];
        data.analytics.dailyTrend[dateKey] = (data.analytics.dailyTrend[dateKey] || 0) + 1;
        
        // 计算响应时间（简单的用户消息到下一个助手消息的时间）
        if (msg.message_type === 'user' && index < messages.length - 1) {
          const nextMsg = messages[index + 1];
          if (nextMsg.message_type === 'assistant') {
            const responseTime = new Date(nextMsg.created_at) - new Date(msg.created_at);
            totalResponseTime += responseTime;
            responsePairs++;
          }
        }
      });
      
      data.analytics.averageResponseTime = responsePairs > 0 ? Math.round(totalResponseTime / responsePairs / 1000) : 0; // 秒
      
      // 获取热门查询（基于知识库查询表）
      const { data: knowledgeQueries } = await supabase
        .from('knowledge_queries')
        .select('query_text, count(*)')
        .group('query_text')
        .order('count', { ascending: false })
        .limit(10);
      
      data.analytics.topQueries = knowledgeQueries || [];
    }
    
    const filename = `chat_export_${sessionId || 'all'}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      const csvData = convertChatsToCSV(data);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json(data);
    }
    
  } catch (error) {
    console.error('Export chats error:', error);
    res.status(500).json({
      error: 'Failed to export chat data',
      details: error.message
    });
  }
});

// 生成学术统计信息
async function generateAcademicsStats(data) {
  const stats = {
    overview: {},
    trends: {},
    categories: {},
    impact: {}
  };
  
  // 出版物统计
  if (data.publications) {
    stats.overview.publications = data.publications.length;
    stats.overview.totalCitations = data.publications.reduce((sum, p) => sum + (p.citations_count || 0), 0);
    stats.overview.avgCitations = data.publications.length > 0 ? Math.round(stats.overview.totalCitations / data.publications.length) : 0;
    
    // 年度趋势
    const yearlyPubs = {};
    data.publications.forEach(pub => {
      yearlyPubs[pub.year] = (yearlyPubs[pub.year] || 0) + 1;
    });
    stats.trends.publicationsByYear = yearlyPubs;
    
    // 类型分布
    const pubTypes = {};
    data.publications.forEach(pub => {
      pubTypes[pub.type] = (pubTypes[pub.type] || 0) + 1;
    });
    stats.categories.publicationTypes = pubTypes;
  }
  
  // 专利统计
  if (data.patents) {
    stats.overview.patents = data.patents.length;
    stats.overview.grantedPatents = data.patents.filter(p => p.status === 'granted').length;
    stats.overview.pendingPatents = data.patents.filter(p => p.status === 'pending').length;
    
    // 专利类型分布
    const patentTypes = {};
    data.patents.forEach(pat => {
      patentTypes[pat.type] = (patentTypes[pat.type] || 0) + 1;
    });
    stats.categories.patentTypes = patentTypes;
  }
  
  // 项目统计
  if (data.projects) {
    stats.overview.projects = data.projects.length;
    stats.overview.completedProjects = data.projects.filter(p => p.status === 'completed').length;
    stats.overview.ongoingProjects = data.projects.filter(p => p.status === 'ongoing').length;
    
    // 项目类别分布
    const projectCategories = {};
    const allTechnologies = new Set();
    
    data.projects.forEach(proj => {
      projectCategories[proj.category] = (projectCategories[proj.category] || 0) + 1;
      if (proj.technologies) {
        proj.technologies.forEach(tech => allTechnologies.add(tech));
      }
    });
    
    stats.categories.projectCategories = projectCategories;
    stats.categories.technologies = Array.from(allTechnologies).sort();
  }
  
  // 奖项统计
  if (data.awards) {
    stats.overview.awards = data.awards.length;
    stats.overview.nationalAwards = data.awards.filter(a => a.level === 'national').length;
    stats.overview.provincialAwards = data.awards.filter(a => a.level === 'provincial').length;
    stats.overview.universityAwards = data.awards.filter(a => a.level === 'university').length;
    
    // 奖项级别分布
    const awardLevels = {};
    data.awards.forEach(award => {
      awardLevels[award.level] = (awardLevels[award.level] || 0) + 1;
    });
    stats.categories.awardLevels = awardLevels;
  }
  
  return stats;
}

// 转换函数
function convertAcademicsToCSV(data) {
  const sections = [];
  
  // 添加导出信息
  sections.push('# Academic Data Export');
  sections.push(`# Generated: ${data.exportInfo.exportedAt}`);
  sections.push(`# Type: ${data.exportInfo.type}`);
  sections.push('');
  
  // 添加统计数据
  if (data.statistics) {
    sections.push('## STATISTICS ##');
    sections.push(JSON.stringify(data.statistics, null, 2));
    sections.push('');
  }
  
  // 转换每个数据类型
  Object.entries(data.data).forEach(([type, records]) => {
    if (!records || records.length === 0) return;
    
    sections.push(`\n## ${type.toUpperCase()} ##\n`);
    
    // 获取所有可能的字段
    const allFields = new Set();
    records.forEach(record => {
      Object.keys(record).forEach(key => allFields.add(key));
    });
    
    const headers = Array.from(allFields);
    sections.push(headers.join(','));
    
    // 添加数据行
    records.forEach(record => {
      const row = headers.map(header => {
        const value = record[header];
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        } else if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      sections.push(row.join(','));
    });
  });
  
  return sections.join('\n');
}

function convertAcademicsToXML(data) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<academic_data_export>\n';
  xml += `  <export_info>\n`;
  xml += `    <type>${data.exportInfo.type}</type>\n`;
  xml += `    <exported_at>${data.exportInfo.exportedAt}</exported_at>\n`;
  xml += `    <language>${data.exportInfo.language}</language>\n`;
  xml += `  </export_info>\n`;
  
  if (data.statistics) {
    xml += '  <statistics>\n';
    xml += `    <overview>${JSON.stringify(data.statistics.overview)}</overview>\n`;
    xml += `  </statistics>\n`;
  }
  
  Object.entries(data.data).forEach(([type, records]) => {
    if (!records || records.length === 0) return;
    
    xml += `  <${type}>\n`;
    records.forEach(record => {
      xml += `    <record>\n`;
      Object.entries(record).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          xml += `      <${key}>${value.join(', ')}</${key}>\n`;
        } else {
          xml += `      <${key}>${value || ''}</${key}>\n`;
        }
      });
      xml += `    </record>\n`;
    });
    xml += `  </${type}>\n`;
  });
  
  xml += '</academic_data_export>';
  return xml;
}

function convertContactsToCSV(data) {
  const sections = [];
  
  sections.push('# Contact Messages Export');
  sections.push(`# Generated: ${data.exportInfo.exportedAt}`);
  sections.push(`# Status: ${data.exportInfo.status}`);
  sections.push(`# Total Records: ${data.exportInfo.totalRecords}`);
  sections.push('');
  
  if (data.statistics) {
    sections.push('## STATISTICS ##');
    sections.push(JSON.stringify(data.statistics, null, 2));
    sections.push('');
  }
  
  if (data.data && data.data.length > 0) {
    sections.push('\n## CONTACT MESSAGES ##\n');
    
    const headers = Object.keys(data.data[0]);
    sections.push(headers.join(','));
    
    data.data.forEach(record => {
      const row = headers.map(header => {
        const value = record[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      sections.push(row.join(','));
    });
  }
  
  return sections.join('\n');
}

function convertChatsToCSV(data) {
  const sections = [];
  
  sections.push('# Chat Messages Export');
  sections.push(`# Generated: ${data.exportInfo.exportedAt}`);
  sections.push(`# Session: ${data.exportInfo.sessionId}`);
  sections.push(`# Total Records: ${data.exportInfo.totalRecords}`);
  sections.push('');
  
  if (data.analytics) {
    sections.push('## ANALYTICS ##');
    sections.push(JSON.stringify(data.analytics, null, 2));
    sections.push('');
  }
  
  if (data.data && data.data.length > 0) {
    sections.push('\n## CHAT MESSAGES ##\n');
    
    const headers = Object.keys(data.data[0]);
    sections.push(headers.join(','));
    
    data.data.forEach(record => {
      const row = headers.map(header => {
        const value = record[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      sections.push(row.join(','));
    });
  }
  
  return sections.join('\n');
}

export default router;