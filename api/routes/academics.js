import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// 初始化Supabase客户端
let supabase = null;
try {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Academics - Supabase URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.log('Academics - Supabase Key:', supabaseKey ? 'SET' : 'MISSING');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase environment variables');
  }
  
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Academics Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Academics Supabase client:', error.message);
}

// 获取所有学术内容（支持分页和筛选）
router.get('/all', async (req, res) => {
  try {
    // 检查Supabase客户端是否可用
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not available',
        message: 'Supabase client is not initialized. Please check server configuration.',
        data: {
          publications: [],
          patents: [],
          projects: [],
          awards: []
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        }
      });
    }

    const { 
      type = 'all', 
      page = 1, 
      limit = 10, 
      search = '', 
      year,
      language = 'zh' 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let results = {};
    
    // 获取论文
    if (type === 'all' || type === 'publications') {
      let publicationsQuery = supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });
      
      if (search) {
        publicationsQuery = publicationsQuery.or(`title.ilike.%${search}%,abstract.ilike.%${search}%,authors.cs.{${search}}`);
      }
      
      if (year) {
        publicationsQuery = publicationsQuery.eq('year', parseInt(year));
      }
      
      const { data: publications, error: pubError } = await publicationsQuery
        .range(offset, offset + parseInt(limit) - 1);
      
      if (pubError) throw pubError;
      results.publications = publications || [];
    }
    
    // 获取专利
    if (type === 'all' || type === 'patents') {
      let patentsQuery = supabase
        .from('patents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (search) {
        patentsQuery = patentsQuery.or(`title.ilike.%${search}%,abstract.ilike.%${search}%,authors.cs.{${search}}`);
      }
      
      const { data: patents, error: patError } = await patentsQuery
        .range(offset, offset + parseInt(limit) - 1);
      
      if (patError) throw patError;
      results.patents = patents || [];
    }
    
    // 获取项目
    if (type === 'all' || type === 'projects') {
      let projectsQuery = supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });
      
      if (search) {
        projectsQuery = projectsQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,technologies.cs.{${search}}`);
      }
      
      if (year) {
        projectsQuery = projectsQuery.eq('year', parseInt(year));
      }
      
      const { data: projects, error: projError } = await projectsQuery
        .range(offset, offset + parseInt(limit) - 1);
      
      if (projError) throw projError;
      results.projects = projects || [];
    }
    
    // 获取奖项
    if (type === 'all' || type === 'awards') {
      let awardsQuery = supabase
        .from('awards')
        .select('*')
        .order('award_date', { ascending: false });
      
      if (search) {
        awardsQuery = awardsQuery.or(`title.ilike.%${search}%,organization.ilike.%${search}%`);
      }
      
      if (year) {
        awardsQuery = awardsQuery.gte('award_date', `${year}-01-01`).lte('award_date', `${year}-12-31`);
      }
      
      const { data: awards, error: awardError } = await awardsQuery
        .range(offset, offset + parseInt(limit) - 1);
      
      if (awardError) throw awardError;
      results.awards = awards || [];
    }
    
    res.json({
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
      },
      filters: { type, search, year, language }
    });
    
  } catch (error) {
    console.error('Get academics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve academic content',
      details: error.message
    });
  }
});

// 获取统计信息
router.get('/stats', async (req, res) => {
  try {
    const { language = 'zh' } = req.query;
    
    // 并行获取所有统计数据
    const [
      { data: publications, error: pubError },
      { data: patents, error: patError },
      { data: projects, error: projError },
      { data: awards, error: awardError }
    ] = await Promise.all([
      supabase.from('publications').select('year, citations_count, type'),
      supabase.from('patents').select('status, type, created_at'),
      supabase.from('projects').select('year, status, category, technologies'),
      supabase.from('awards').select('level, award_date')
    ]);
    
    if (pubError || patError || projError || awardError) {
      throw new Error('Failed to fetch statistics data');
    }
    
    // 计算统计信息
    const stats = {
      overview: {
        totalPublications: publications.length,
        totalPatents: patents.length,
        totalProjects: projects.length,
        totalAwards: awards.length
      },
      publications: {
        byYear: {},
        byType: {},
        totalCitations: publications.reduce((sum, p) => sum + (p.citations_count || 0), 0),
        averageCitations: publications.length > 0 ? Math.round(publications.reduce((sum, p) => sum + (p.citations_count || 0), 0) / publications.length) : 0
      },
      patents: {
        byStatus: {},
        byType: {},
        recentCount: patents.filter(p => {
          const createdDate = new Date(p.created_at);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          return createdDate >= oneYearAgo;
        }).length
      },
      projects: {
        byStatus: {},
        byYear: {},
        byCategory: {},
        technologies: new Set()
      },
      awards: {
        byLevel: {},
        recentCount: awards.filter(a => {
          const awardDate = new Date(a.award_date);
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
          return awardDate >= twoYearsAgo;
        }).length
      }
    };
    
    // 处理出版物统计
    publications.forEach(pub => {
      stats.publications.byYear[pub.year] = (stats.publications.byYear[pub.year] || 0) + 1;
      stats.publications.byType[pub.type] = (stats.publications.byType[pub.type] || 0) + 1;
    });
    
    // 处理专利统计
    patents.forEach(pat => {
      stats.patents.byStatus[pat.status] = (stats.patents.byStatus[pat.status] || 0) + 1;
      stats.patents.byType[pat.type] = (stats.patents.byType[pat.type] || 0) + 1;
    });
    
    // 处理项目统计
    projects.forEach(proj => {
      stats.projects.byStatus[proj.status] = (stats.projects.byStatus[proj.status] || 0) + 1;
      stats.projects.byYear[proj.year] = (stats.projects.byYear[proj.year] || 0) + 1;
      stats.projects.byCategory[proj.category] = (stats.projects.byCategory[proj.category] || 0) + 1;
      if (proj.technologies) {
        proj.technologies.forEach(tech => stats.projects.technologies.add(tech));
      }
    });
    
    // 处理奖项统计
    awards.forEach(award => {
      stats.awards.byLevel[award.level] = (stats.awards.byLevel[award.level] || 0) + 1;
    });
    
    // 转换Set为Array
    stats.projects.technologies = Array.from(stats.projects.technologies);
    
    res.json({
      stats,
      generatedAt: new Date().toISOString(),
      language
    });
    
  } catch (error) {
    console.error('Get academics stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve academic statistics',
      details: error.message
    });
  }
});

// 获取时间线数据
router.get('/timeline', async (req, res) => {
  try {
    const { language = 'zh', limit = 50 } = req.query;
    
    // 获取所有带时间的数据
    const [
      { data: publications, error: pubError },
      { data: patents, error: patError },
      { data: projects, error: projError },
      { data: awards, error: awardError }
    ] = await Promise.all([
      supabase.from('publications').select('id, title, year, type').order('year', { ascending: false }),
      supabase.from('patents').select('id, title, public_date, status').order('public_date', { ascending: false }),
      supabase.from('projects').select('id, title, year, status, category').order('year', { ascending: false }),
      supabase.from('awards').select('id, title, award_date, level').order('award_date', { ascending: false })
    ]);
    
    if (pubError || patError || projError || awardError) {
      throw new Error('Failed to fetch timeline data');
    }
    
    // 构建时间线事件
    const timelineEvents = [];
    
    // 添加出版物事件
    publications.forEach(pub => {
      timelineEvents.push({
        id: pub.id,
        type: 'publication',
        title: pub.title,
        date: `${pub.year}-01-01`,
        year: pub.year,
        category: pub.type,
        icon: '📄'
      });
    });
    
    // 添加专利事件
    patents.forEach(pat => {
      timelineEvents.push({
        id: pat.id,
        type: 'patent',
        title: pat.title,
        date: pat.public_date,
        year: new Date(pat.public_date).getFullYear(),
        category: pat.status,
        icon: '🔬'
      });
    });
    
    // 添加项目事件
    projects.forEach(proj => {
      timelineEvents.push({
        id: proj.id,
        type: 'project',
        title: proj.title,
        date: `${proj.year}-01-01`,
        year: proj.year,
        category: proj.category,
        status: proj.status,
        icon: '⚙️'
      });
    });
    
    // 添加奖项事件
    awards.forEach(award => {
      timelineEvents.push({
        id: award.id,
        type: 'award',
        title: award.title,
        date: award.award_date,
        year: new Date(award.award_date).getFullYear(),
        category: award.level,
        icon: '🏆'
      });
    });
    
    // 按日期排序
    timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 限制数量
    const limitedEvents = timelineEvents.slice(0, parseInt(limit));
    
    res.json({
      events: limitedEvents,
      total: timelineEvents.length,
      language,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({
      error: 'Failed to retrieve timeline data',
      details: error.message
    });
  }
});

// 导出学术数据
router.get('/export', async (req, res) => {
  try {
    const { format = 'json', type = 'all', language = 'zh' } = req.query;
    
    // 获取数据
    const data = {};
    
    if (type === 'all' || type === 'publications') {
      const { data: publications } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });
      data.publications = publications || [];
    }
    
    if (type === 'all' || type === 'patents') {
      const { data: patents } = await supabase
        .from('patents')
        .select('*')
        .order('public_date', { ascending: false });
      data.patents = patents || [];
    }
    
    if (type === 'all' || type === 'projects') {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('year', { ascending: false });
      data.projects = projects || [];
    }
    
    if (type === 'all' || type === 'awards') {
      const { data: awards } = await supabase
        .from('awards')
        .select('*')
        .order('award_date', { ascending: false });
      data.awards = awards || [];
    }
    
    // 设置文件名
    const filename = `academic_data_${type}_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      // CSV格式导出
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvData);
    } else {
      // JSON格式导出（默认）
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      res.json({
        exportInfo: {
          type,
          format,
          language,
          exportedAt: new Date().toISOString(),
          totalRecords: Object.values(data).reduce((sum, arr) => sum + arr.length, 0)
        },
        data
      });
    }
    
  } catch (error) {
    console.error('Export academics error:', error);
    res.status(500).json({
      error: 'Failed to export academic data',
      details: error.message
    });
  }
});

// CSV转换辅助函数
function convertToCSV(data) {
  const sections = [];
  
  // 转换每个数据类型为CSV
  Object.entries(data).forEach(([type, records]) => {
    if (records.length === 0) return;
    
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

export default router;